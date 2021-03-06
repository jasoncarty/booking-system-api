import { UserDto } from './index';
import { AttendeesDto } from './attendees.dto';

export interface EventWithAttendeesDto {
  id: number;
  name?: string;
  description?: string;
  starts_at?: Date;
  ends_at?: Date;
  title?: string;
  preview?: string;
  maximum_event_attendees?: number;
  created_at: Date;
  updated_at: Date;
  attendees?: AttendeesDto;
  nonAttendees?: UserDto[];
}
