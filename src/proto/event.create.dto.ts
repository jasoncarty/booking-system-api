export interface EventCreateDto {
  name?: string;
  description?: string;
  starts_at?: Date;
  ends_at?: Date;
  title?: string;
  preview?: string;
  maximum_event_attendees?: number;
}
