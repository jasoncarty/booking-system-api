import { IsEmail, IsString, MinLength, Validate } from 'class-validator';
import { IsStrongPassword } from '../utils/IsStrongPassword';

export class UserConfirmAccountDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Validate(IsStrongPassword)
  password: string;
}
