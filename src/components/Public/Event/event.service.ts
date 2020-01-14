import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from './../../../Repositories/event.entity';
import { ExceptionDictionary, EventWithAttendeesDto, ErrorCode } from '../../../dto';
import { UserService } from '../User/user.service';
import { EventAttendeeService } from '../EventAttendee/eventAttendee.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly eventAttendeeService: EventAttendeeService,
    private readonly userService: UserService,
  ) {}

  private findAndRemoveItem(array: any[], id: number): any[] {
    const index = array.findIndex((item): boolean => item.id === id);
    const newArray = [...array];
    if (index !== -1) {
      newArray.splice(index, 1);
    }
    return newArray;
  }

  async getEvent(id: number): Promise<EventWithAttendeesDto> {
    try {
      const event = await this.eventRepository.findOne(id);
      if (event) {
        return {
          ...event,
          attendees: await this.userService.getAttendees(id),
        };
      }
      throw new Error();
    } catch (err) {
      throw ExceptionDictionary({
        stack: err.stack,
        errorCode: ErrorCode.EVENT_NOT_FOUND,
      });
    }
  }

  async getCurrentEvents(): Promise<EventWithAttendeesDto[]> {
    try {
      const events = await this.eventRepository
        .createQueryBuilder('events')
        .where('starts_at >= :time', { time: new Date().toISOString() })
        .orderBy('starts_at', 'DESC')
        .getMany();
      if (events) {
        const map = events.map(
          (event): Promise<EventWithAttendeesDto> => this.getEvent(event.id),
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

  async fetchEventWithAttendees(id: number): Promise<Event> {
    return await this.eventRepository.findOne({
      where: {
        id,
      },
      relations: ['eventAttendees'],
    });
  }

  async bookEvent(id: number, authHeader: string): Promise<EventWithAttendeesDto> {
    const user = await this.userService.getProfile(authHeader, true);
    const event = await this.fetchEventWithAttendees(id);

    if (event && user) {
      const newEventAttendee = await this.eventAttendeeService.createNewEventAttendee(
        user.id,
        event,
      );
      event.eventAttendees = [...event.eventAttendees, newEventAttendee];
      user.eventAttendees = [...user.eventAttendees, newEventAttendee];
      await this.userService.save(user);
      await this.eventRepository.save(event);

      // refetch event in order to load relations.
      return {
        ...(await this.getEvent(id)),
        attendees: await this.userService.getAttendees(id),
      };
    }
    throw ExceptionDictionary({ errorCode: ErrorCode.EVENT_BOOKING_ERROR });
  }

  async cancelEventBooking(
    id: number,
    authHeader: string,
  ): Promise<EventWithAttendeesDto> {
    const user = await this.userService.getProfile(authHeader, true);
    const event = await this.fetchEventWithAttendees(id);

    if (event && user) {
      const eventAttendee = await this.eventAttendeeService.findEventAttendee(
        user.id,
        event.id,
      );

      this.eventAttendeeService.deleteEventAttendee(eventAttendee);
      user.eventAttendees = this.findAndRemoveItem(user.eventAttendees, eventAttendee.id);
      event.eventAttendees = this.findAndRemoveItem(
        event.eventAttendees,
        eventAttendee.id,
      );

      await this.userService.save(user);
      await this.eventRepository.save(event);

      // refetch event in order to load relations.
      return {
        ...(await this.getEvent(id)),
        attendees: await this.userService.getAttendees(id),
      };
    }
    throw ExceptionDictionary({
      errorCode: ErrorCode.EVENT_CANCEL_ERROR,
    });
  }
}
