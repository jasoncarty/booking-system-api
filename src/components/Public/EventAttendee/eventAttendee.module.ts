import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventAttendee } from '../../../Repositories/eventAttendee.entity';
import { EventAttendeeService } from './eventAttendee.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventAttendee])],
  providers: [EventAttendeeService],
  exports: [EventAttendeeService],
})
export class EventAttendeeModule {}
