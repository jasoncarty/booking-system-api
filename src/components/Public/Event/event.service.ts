import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from './../../../Repositories/event.entity';
import { EventDto, ExceptionDictionary } from '../../../proto';
import { UserService } from '../User/user.service';
import { EventAttendeeService } from '../EventAttendee/eventAttendee.service';
import { EventAttendee } from './../../../Repositories/eventAttendee.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly eventAttendeeService: EventAttendeeService,
    private readonly userService: UserService,
  ) {}

  async getEvent(id: number): Promise<EventDto> {
    try {
      const event = await this.eventRepository.findOne(id);
      if (event) {
        return event;
      }
      throw new Error();
    } catch (err) {
      throw new ExceptionDictionary(err.stack).EVENT_NOT_FOUND;
    }
  }

  async getCurrentEvents(): Promise<EventDto[]> {
    try {
      const events = await this.eventRepository
        .createQueryBuilder('events')
        .where('starts_at >= :time', { time: new Date().toISOString() })
        .getMany();
      if (events) {
        return events;
      }
      return [];
    } catch (err) {
      throw new ExceptionDictionary(err.stack).EVENT_FETCHING_ERROR;
    }
  }

  async bookEvent(id: number, authHeader: string): Promise<EventDto> {
    const user = await this.userService.getProfile(authHeader, true);
    const event = await this.eventRepository.findOne({
      where: {
        id,
      },
      relations: ['eventAttendees'],
    });

    if (event && user) {
      const newEventAttendee = await this.eventAttendeeService.createNewEventAttendee(
        user,
        event,
      );
      event.eventAttendees = [...event.eventAttendees, newEventAttendee];
      user.eventAttendees = [...user.eventAttendees, newEventAttendee];
      await this.userService.save(user);
      return await this.eventRepository.save(event);
    }
    throw new ExceptionDictionary().EVENT_BOOKING_ERROR;
  }
}
