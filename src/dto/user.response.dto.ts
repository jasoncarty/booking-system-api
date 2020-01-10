import { UserRole } from './userRole.enum';

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  confirmed: boolean;
  confirmed_at?: Date;
  verification_sent_at?: Date;
  password_reset_token_sent_at?: Date;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}
