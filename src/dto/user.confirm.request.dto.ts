import { IsEmail } from 'class-validator';

export class UserConfirmRequestDto {
  @IsEmail()
  email: string;
}
