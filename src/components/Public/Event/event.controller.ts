import { Controller, Get, Param } from '@nestjs/common';

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
}
