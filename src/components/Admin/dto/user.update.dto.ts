import { UserRole } from './../../../proto';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UserUpdateDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  role?: UserRole;
}
