import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EventAttendee } from './../../../Repositories/eventAttendee.entity';
import { Event } from './../../../Repositories/event.entity';
import { ExceptionDictionary, ErrorCode } from '../../../proto';

@Injectable()
export class EventAttendeeService {
  constructor(
    @InjectRepository(EventAttendee)
    private readonly eventAttendeeRepository: Repository<EventAttendee>,
  ) {}

  async findEventAttendee(userId: number, eventId: number): Promise<EventAttendee> {
    return await this.eventAttendeeRepository.findOne({
      where: {
        userId,
        eventId,
      },
    });
  }

  private getReserve(event: Event): boolean {
    const max = event.maximum_event_attendees;
    if (event.eventAttendees.length >= max) {
      return true;
    }
    return false;
  }

  async createNewEventAttendee(userId: number, event: Event): Promise<EventAttendee> {
    const duplicateEventAttendee = await this.findEventAttendee(userId, event.id);

    if (duplicateEventAttendee) {
      throw ExceptionDictionary({
        errorCode: ErrorCode.DUPLICATE_EVENT_ATTENDEE_ERROR,
      });
    }
    try {
      const newEventAttendee = new EventAttendee();
      Object.assign(newEventAttendee, {
        eventId: event.id,
        userId: userId,
        reserve: this.getReserve(event),
      });
      return await this.eventAttendeeRepository.save(newEventAttendee);
    } catch (err) {
      throw ExceptionDictionary({
        stack: err.stack,
        errorCode: ErrorCode.EVENT_ATTENDEE_CREATION_ERROR,
      });
    }
  }

  async deleteEventAttendee(eventAttendee: EventAttendee): Promise<EventAttendee> {
    try {
      return await this.eventAttendeeRepository.remove(eventAttendee);
    } catch (err) {
      throw ExceptionDictionary({
        stack: err.stack,
        errorCode: ErrorCode.EVENT_ATTENDEE_DELETION_ERROR,
      });
    }
  }
}
