import { IsEmail, IsString } from 'class-validator';

export class AuthenticationCreateDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  password: string;
}
