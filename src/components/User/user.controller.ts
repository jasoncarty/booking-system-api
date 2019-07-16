import { Controller, Get, Req, Put, Body, Post, Param } from '@nestjs/common';
import { Request } from 'express';

import { UserService } from './user.service';
import { UserDto } from '../../proto';

@Controller('users')
export class UserController {
  constructor(private service: UserService) {}

  @Get('profile/')
  getProfile(@Req() request: Request): Promise<UserDto> {
    return this.service.getProfile(request.headers.authorization);
  }

  @Put()
  updateUser(@Body() body, @Req() request: Request): Promise<UserDto> {
    return this.service.updateUser(request.headers.authorization, body);
  }

  @Post('/confirmation/request')
  requestConfirmation(@Body() body): Promise<{}> {
    return this.service.requestConfirmation(body.email);
  }

  @Post('/confirmation/confirm/:verificationToken')
  confirmAccount(@Body() body, @Param() params): Promise<UserDto> {
    return this.service.confirmAccount(body, params.verificationToken);
  }
}
