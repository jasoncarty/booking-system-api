import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from './../../../Repositories/event.entity';
import { ExceptionDictionary, EventWithAttendeesDto } from '../../../proto';
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
      throw new ExceptionDictionary(err.stack).EVENT_FETCHING_ERROR;
    }
  }

  async getEvent(id: number): Promise<EventWithAttendeesDto> {
    return {
      ...(await this.eventService.getEvent(id)),
      nonAttendees: await this.userService.getNonAttendees(id),
    };
  }
}
