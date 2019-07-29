import { IsEmail, IsString, IsOptional, MinLength, Validate } from 'class-validator';
import { IsStrongPassword } from '../../../utils/IsStrongPassword';

export class UserUpdateDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @Validate(IsStrongPassword)
  password?: string;
}
