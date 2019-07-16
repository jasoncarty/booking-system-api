import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';

import { AdminService } from './admin.service';
import { CreateUserDto } from '../../proto';
import { User } from './../User/user.entity';

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
  createUser(@Body() user: CreateUserDto): Promise<User> {
    return this.adminService.createUser(user);
  }

  @Put('users/update/:id')
  updateUser(@Param() params, @Body() body): Promise<User> {
    return this.adminService.updateUser(params.id, body);
  }

  @Delete('users/delete/:id')
  deleteUser(@Param() params): Promise<User> {
    return this.adminService.deleteUser(params.id);
  }
}
