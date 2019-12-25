export interface EventAttendeeDto {
  userId: number;
  eventId: number;
  reserve: boolean;
  created_at: Date;
  updated_at: Date;
}
