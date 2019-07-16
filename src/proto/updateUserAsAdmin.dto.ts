import { UserRole } from './userRole.enum';

export interface UpdateUserAsAdminDto {
  name: string;
  email: string;
  role?: UserRole;
}
