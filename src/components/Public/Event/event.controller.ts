import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';

import { EventService } from './event.service';
import { EventDto } from './../../../proto';

@Controller('events')
export class EventController {
  constructor(private service: EventService) {}

  @Get()
  getCurrentEvents(): Promise<EventDto[]> {
    return this.service.getCurrentEvents();
  }

  @Get('/:id')
  getEvent(@Param() params): Promise<EventDto> {
    return this.service.getEvent(params.id);
  }

  @Post('/book/:id')
  bookEvent(@Param() params, @Req() request: Request): Promise<EventDto> {
    return this.service.bookEvent(params.id, request.headers.authorization);
  }

  @Post('/cancel/:id')
  cancelEventBooking(@Param() params, @Req() request: Request): Promise<EventDto> {
    return this.service.cancelEventBooking(params.id, request.headers.authorization);
  }
}
