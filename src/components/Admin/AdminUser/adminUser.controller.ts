import { Controller, Get, Post, Param, Body, Put, Delete, Req } from '@nestjs/common';
import { Request } from 'express';

import { AdminService } from './adminUser.service';
import { AdminUserUpdateDto, AdminUserCreateDto } from './../../../proto';
import { UserResponse } from '../../../proto/user.response.dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('/users')
  getUsers(): Promise<UserResponse[]> {
    return this.adminService.getUsers();
  }

  @Get('users/:id')
  getUser(@Param() params): Promise<UserResponse> {
    return this.adminService.getUser(params.id);
  }

  @Post('users/create')
  createUser(@Body() userCreateDto: AdminUserCreateDto): Promise<UserResponse> {
    return this.adminService.createUser(userCreateDto);
  }

  @Put('users/update/:id')
  updateUser(
    @Param() params,
    @Body() userUpdateDto: AdminUserUpdateDto,
  ): Promise<UserResponse> {
    return this.adminService.updateUser(params.id, userUpdateDto);
  }

  @Delete('users/delete/:id')
  deleteUser(@Param() params, @Req() request: Request): Promise<UserResponse> {
    return this.adminService.deleteUser(request.headers.authorization, params.id);
  }
}
