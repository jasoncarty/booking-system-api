import { IsEmail, IsString } from 'class-validator';

export class UserConfirmationValidator {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
