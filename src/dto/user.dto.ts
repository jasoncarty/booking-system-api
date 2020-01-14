import { EventAttendee } from '../Repositories/eventAttendee.entity';
import { UserRole } from './userRole.enum';

export interface UserDto {
  id: number;
  name: string;
  email: string;
  password?: string;
  confirmed: boolean;
  confirmed_at?: Date;
  verification_token?: string;
  verification_sent_at?: Date;
  password_reset_token?: string;
  password_reset_token_sent_at?: Date;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
  eventAttendees?: EventAttendee[];
}
