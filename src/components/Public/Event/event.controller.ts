import { Controller, Get, Req, Put, Body, Post, Param } from '@nestjs/common';
import { Request } from 'express';

import { EventService } from './event.service';
import { EventDto } from './../../../proto';

@Controller('events')
export class EventController {
  constructor(private service: EventService) {}

  @Get('event/:id')
  getEvent(@Param() params): Promise<EventDto> {
    return this.service.getEvent(params.id);
  }
}
