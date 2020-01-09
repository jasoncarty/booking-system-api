import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AdminEventController } from './adminEvent.controller';
import { AdminEventService } from './adminEvent.service';
import { EventModule } from '../../Public/Event/event.module';
import { EventAttendeeModule } from '../../Public/EventAttendee/eventAttendee.module';
import { UserModule } from '../../Public/User/user.module';
import { Event } from '../../../Repositories/event.entity';

@Module({
  providers: [AdminEventService],
  imports: [
    TypeOrmModule.forFeature([Event]),
    EventModule,
    EventAttendeeModule,
    UserModule,
  ],
  controllers: [AdminEventController],
  exports: [AdminEventService],
})
export class AdminEventModule {}
