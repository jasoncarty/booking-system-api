import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UserUpdateValidator {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name: string;
}
