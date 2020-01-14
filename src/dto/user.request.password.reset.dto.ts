import { IsEmail } from 'class-validator';

export class UserRequestPasswordResetDto {
  @IsEmail()
  email: string;
}
