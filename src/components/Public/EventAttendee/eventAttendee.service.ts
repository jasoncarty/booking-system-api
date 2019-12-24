import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EventAttendee } from './../../../Repositories/eventAttendee.entity';
import { Event } from './../../../Repositories/event.entity';
import { UserDto, ExceptionDictionary } from '../../../proto';

@Injectable()
export class EventAttendeeService {
  constructor(
    @InjectRepository(EventAttendee)
    private readonly eventAttendeeRepository: Repository<EventAttendee>,
  ) {}

  getReserve(event: Event): boolean {
    const max = event.maximum_event_attendees;
    if (event.eventAttendees.length >= max) {
      return true;
    }
    return false;
  }

  async createNewEventAttendee(user: UserDto, event: Event): Promise<EventAttendee> {
    const duplicateEventAttendee = await this.eventAttendeeRepository.find({
      where: {
        userId: user.id,
        eventId: event.id,
      },
    });

    if (duplicateEventAttendee && duplicateEventAttendee.length) {
      throw new ExceptionDictionary().DUPLICATE_EVENT_ATTENDEE_ERROR;
    }

    try {
      const newEventAttendee = new EventAttendee();
      Object.assign(newEventAttendee, {
        eventId: event.id,
        userId: user.id,
        reserve: this.getReserve(event),
      });
      return await this.eventAttendeeRepository.save(newEventAttendee);
    } catch (err) {
      throw new ExceptionDictionary(err.stack).EVENT_ATTENDEE_CREATION_ERROR;
    }
  }
}
