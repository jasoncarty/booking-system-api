import { UserDto } from '../../../proto/user.dto';

export interface AuthenticatedUserDto {
  user: UserDto;
  token: string;
}
