import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EventService } from './event.service';
import { EventController } from './event.controller';
import { Event } from '../../../Repositories/event.entity';
import { EventAttendeeModule } from '../EventAttendee/eventAttendee.module';
import { UserModule } from '../User/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), EventAttendeeModule, UserModule],
  providers: [EventService],
  controllers: [EventController],
  exports: [EventService],
})
export class EventModule {}
