import { Controller, Get, Req, Put, Body, Post, Param } from '@nestjs/common';
import { Request } from 'express';

import { UserService } from './user.service';
import { UserDto } from '../../../proto';
import { UserConfirmAccountDto, UserUpdateDto, UserConfirmRequestDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private service: UserService) {}

  @Get('profile/')
  getProfile(@Req() request: Request): Promise<UserDto> {
    return this.service.getProfile(request.headers.authorization);
  }

  @Put()
  updateUser(
    @Body() userUpdateDto: UserUpdateDto,
    @Req() request: Request,
  ): Promise<UserDto> {
    return this.service.updateUser(request.headers.authorization, userUpdateDto);
  }

  @Post('/confirmation/request')
  requestConfirmation(@Body() userConfirmRequestDto: UserConfirmRequestDto): Promise<{}> {
    return this.service.requestConfirmation(userConfirmRequestDto);
  }

  @Post('/confirmation/confirm/:verificationToken')
  confirmAccount(
    @Body() userConfirmAccountDto: UserConfirmAccountDto,
    @Param() params,
  ): Promise<UserDto> {
    return this.service.confirmAccount(userConfirmAccountDto, params.verificationToken);
  }
}
