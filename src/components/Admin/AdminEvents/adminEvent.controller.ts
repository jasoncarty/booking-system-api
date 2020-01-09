import { Controller, Get, Post, Param, Body, Put, Delete, Req } from '@nestjs/common';

import {
  EventWithAttendeesDto,
  EventDto,
  EventCreateDto,
  EventUpdateDto,
} from './../../../proto';
import { AdminEventService } from './adminEvent.service';

@Controller('admin')
export class AdminEventController {
  constructor(private adminEventService: AdminEventService) {}

  @Get('/events')
  getCurrentEvents(): Promise<EventWithAttendeesDto[]> {
    return this.adminEventService.getCurrentEvents();
  }

  @Get('/events/old')
  getOldEvents(): Promise<EventWithAttendeesDto[]> {
    return this.adminEventService.getOldEvents();
  }

  @Get('events/:id')
  getEvent(@Param() params): Promise<EventWithAttendeesDto> {
    return this.adminEventService.getEvent(params.id);
  }

  @Post('events/create')
  createEvent(@Body() eventCreateDto: EventCreateDto): Promise<EventWithAttendeesDto> {
    return this.adminEventService.createEvent(eventCreateDto);
  }

  @Put('events/:id')
  updateEvent(
    @Param() params,
    @Body() eventUpdateDto: EventUpdateDto,
  ): Promise<EventDto> {
    return this.adminEventService.updateEvent(params.id, eventUpdateDto);
  }

  @Delete('events/:id')
  deleteEvent(@Param() params): Promise<EventDto> {
    return this.adminEventService.deleteEvent(params.id);
  }
}
