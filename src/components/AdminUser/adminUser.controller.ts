import { Controller, Get, Post, Param, Body, Put, Delete, Req } from '@nestjs/common';
import { Request } from 'express';

import { AdminService } from './adminUser.service';
import { User } from '../../Repositories/user.entity';
import { UserUpdateDto, UserCreateDto } from './dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('/users')
  getUsers(): Promise<User[]> {
    return this.adminService.getUsers();
  }

  @Get('users/:id')
  getUser(@Param() params): Promise<User> {
    return this.adminService.getUser(params.id);
  }

  @Post('users/create')
  createUser(@Body() userCreateDto: UserCreateDto): Promise<User> {
    return this.adminService.createUser(userCreateDto);
  }

  @Put('users/update/:id')
  updateUser(@Param() params, @Body() userUpdateDto: UserUpdateDto): Promise<User> {
    return this.adminService.updateUser(params.id, userUpdateDto);
  }

  @Delete('users/delete/:id')
  deleteUser(@Param() params, @Req() request: Request): Promise<User> {
    return this.adminService.deleteUser(request.headers.authorization, params.id);
  }
}
