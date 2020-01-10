import { IsEmail, IsOptional, IsString } from 'class-validator';

import { UserRole } from '.';

export class AdminUserUpdateDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  role?: UserRole;
}
