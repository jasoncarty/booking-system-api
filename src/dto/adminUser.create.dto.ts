import { IsEmail, IsString } from 'class-validator';

export class AdminUserCreateDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;
}
