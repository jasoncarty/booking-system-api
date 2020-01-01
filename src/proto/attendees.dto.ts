import { UserDto } from './index';

export interface Attendees {
  reserves: UserDto[];
  nonReserves: UserDto[];
}
