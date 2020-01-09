import { UserDto } from './index';

export interface AttendeesDto {
  reserves: UserDto[];
  nonReserves: UserDto[];
}
