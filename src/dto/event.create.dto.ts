import { IsDateString, IsNumber, IsOptional, IsString, Validate } from 'class-validator';

import { AttendeeIdsDto } from './index';
import { IsAttendees } from '../utils';

export class EventCreateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  starts_at?: Date;

  @IsOptional()
  @IsDateString()
  ends_at?: Date;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  preview?: string;

  @IsOptional()
  @IsNumber()
  maximum_event_attendees?: number;

  @IsOptional()
  @Validate(IsAttendees)
  attendees?: AttendeeIdsDto;
}
