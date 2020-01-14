import { Controller, Post, Body } from '@nestjs/common';

import { UserService } from '../Public/User/user.service';
import { AuthenticationCreateDto, AuthenticatedUserDto } from '../../dto';

@Controller('authentication')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('/create')
  createSession(
    @Body() authenticationCreateDto: AuthenticationCreateDto,
  ): Promise<AuthenticatedUserDto> {
    return this.userService.loginUser(authenticationCreateDto);
  }
}
