import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from './../../../Repositories/event.entity';
import { EventAttendee } from './../../../Repositories/eventAttendee.entity';
import {
  ExceptionDictionary,
  EventWithAttendeesDto,
  EventCreateDto,
  EventDto,
  ErrorCode,
  EventUpdateDto,
  AttendeeIdsDto,
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

  async addUsers(mixedAttendees: number[], event: Event): Promise<void> {
    for (let i = 0; i < mixedAttendees.length; i++) {
      const eventAttendee = await this.eventAttendeeService.createNewEventAttendee(
        mixedAttendees[i],
        event,
      );
      const user = await this.userService.getUser(mixedAttendees[i], true);
      user.eventAttendees = [...user.eventAttendees, eventAttendee];
      await this.userService.save(user);
      event.eventAttendees = [...event.eventAttendees, eventAttendee];
      await this.eventRepository.save(event);
    }
  }

  async removeEventAttendees(event: Event): Promise<void> {
    const { eventAttendees } = event;
    for (let i = 0; i < eventAttendees.length; i++) {
      await this.eventAttendeeService.deleteEventAttendee(eventAttendees[i]);
    }
    event.eventAttendees = [];
    await this.eventRepository.save(event);
  }

  async consolidateAttendees(attendees: AttendeeIdsDto, event: Event): Promise<void> {
    if (attendees) {
      const reserves = attendees.reserves || [];
      const nonReserves = attendees.nonReserves || [];
      const mixedAttendees = [...nonReserves, ...reserves];
      await this.addUsers(mixedAttendees, event);
    }
  }

  async createEvent(data: EventCreateDto): Promise<EventWithAttendeesDto> {
    const attendees = data.attendees;
    const event = {
      ...data,
      attendees: null,
    };

    const savedEvent = await this.eventRepository.save(event);
    const newEvent = await this.eventRepository.findOne({
      where: { id: savedEvent.id },
      relations: ['eventAttendees'],
    });

    await this.consolidateAttendees(attendees, newEvent);

    // refetch event in order to load relations.
    return {
      ...(await this.getEvent(newEvent.id)),
      attendees: await this.userService.getAttendees(newEvent.id),
    };
  }

  async updateEvent(id: number, data: EventUpdateDto): Promise<EventWithAttendeesDto> {
    const attendees = data.attendees;
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['eventAttendees'],
    });

    delete data.attendees;
    const eventEntity = new Event();
    Object.assign(eventEntity, data);
    await this.eventRepository.update(id, eventEntity);
    await this.removeEventAttendees(event);
    await this.consolidateAttendees(attendees, event);

    // refetch event in order to load relations.
    return {
      ...(await this.getEvent(id)),
      attendees: await this.userService.getAttendees(id),
    };
  }

  async deleteEvent(id: number): Promise<EventDto> {
    const event = await this.eventRepository.findOne(id);
    return await this.eventRepository.remove(event);
  }
}
