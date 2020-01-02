import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from './../../../Repositories/event.entity';
import {
  ExceptionDictionary,
  EventWithAttendeesDto,
  EventCreateDto,
  EventDto,
  ErrorCode,
} from '../../../proto';
import { EventService } from '../../Public/Event/event.service';
import { UserService } from '../../Public/User/user.service';
import { EventAttendeeService } from '../../Public/EventAttendee/eventAttendee.service';

@Injectable()
export class AdminEventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly eventService: EventService,
    private readonly eventAttendeeService: EventAttendeeService,
    private readonly userService: UserService,
  ) {}

  getCurrentEvents(): Promise<EventWithAttendeesDto[]> {
    return this.eventService.getCurrentEvents();
  }

  async getOldEvents(): Promise<EventWithAttendeesDto[]> {
    try {
      const events = await this.eventRepository
        .createQueryBuilder('events')
        .where('starts_at < :time', { time: new Date().toISOString() })
        .getMany();
      if (events) {
        const map = events.map(
          (event): Promise<EventWithAttendeesDto> => this.eventService.getEvent(event.id),
        );
        return Promise.all([...map]).then((values): EventWithAttendeesDto[] => values);
      }
      return [];
    } catch (err) {
      throw ExceptionDictionary({
        stack: err.stack,
        errorCode: ErrorCode.EVENT_FETCHING_ERROR,
      });
    }
  }

  async getEvent(id: number): Promise<EventWithAttendeesDto> {
    return {
      ...(await this.eventService.getEvent(id)),
      nonAttendees: await this.userService.getNonAttendees(id),
    };
  }

  async addUsers(mixedAttendees: number[], newEvent: Event): Promise<void> {
    for (let i = 0; i < mixedAttendees.length; i++) {
      const eventAttendee = await this.eventAttendeeService.createNewEventAttendee(
        mixedAttendees[i],
        newEvent,
      );
      const user = await this.userService.getUser(mixedAttendees[i], true);
      user.eventAttendees = [...user.eventAttendees, eventAttendee];
      await this.userService.save(user);
      newEvent.eventAttendees = [...newEvent.eventAttendees, eventAttendee];
      await this.eventRepository.save(newEvent);
    }
  }

  async createEvent(data: EventCreateDto): Promise<EventWithAttendeesDto> {
    const { attendees } = data || {};
    const event = {
      ...data,
      attendees: null,
    };

    const savedEvent = await this.eventRepository.save(event);
    const newEvent = await this.eventRepository.findOne({
      where: { id: savedEvent.id },
      relations: ['eventAttendees'],
    });
    const { reserves, nonReserves } = attendees;
    const mixedAttendees = [...nonReserves, ...reserves];
    await this.addUsers(mixedAttendees, newEvent);

    // refetch event in order to load relations.
    return {
      ...(await this.getEvent(newEvent.id)),
      attendees: await this.userService.getAttendees(newEvent.id),
    };
  }

  async deleteEvent(id: number): Promise<EventDto> {
    const event = await this.eventRepository.findOne(id);
    return await this.eventRepository.remove(event);
  }
}
