import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from './../../../Repositories/event.entity';
import { EventDto, ExceptionDictionary } from '../../../proto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
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
}
