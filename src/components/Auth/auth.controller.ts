import { Controller, Post, Body } from '@nestjs/common';

import { UserService } from './../User/user.service';
import { AuthenticatedUserDto, UserLoginDto } from '../../proto';

@Controller('authentication')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('/create')
  createSession(@Body() data: UserLoginDto): Promise<AuthenticatedUserDto> {
    return this.userService.loginUser(data);
  }
}
