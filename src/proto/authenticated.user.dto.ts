import { UserDto } from './user.dto';

export interface AuthenticatedUserDto {
  user: UserDto;
  token: string;
}
