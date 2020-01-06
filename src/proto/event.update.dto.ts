import { AttendeeIdsDto } from './index';
import { IsString, IsOptional, IsNumber, IsDateString, Validate } from 'class-validator';
import { IsAttendees } from './../utils';

export class EventUpdateDto {
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
