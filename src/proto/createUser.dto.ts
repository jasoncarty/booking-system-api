import { UserRole } from './userRole.enum';

export interface CreateUserDto {
  name: string;
  email: string;
  role: UserRole;
  verification_token: string;
}
