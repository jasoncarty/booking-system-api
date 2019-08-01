import { Injectable, Scope } from '@nestjs/common';

import { UserService } from './../User/user.service';
import { UserRole, UserDto } from '../../proto';
import { verifyToken } from '../../utils';
import { ExceptionDictionary } from './../../proto';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async authenticateUser(token: string): Promise<UserDto> {
    return await this.verifyAndFindUser(token);
  }

  async authenticateAdmin(token: string): Promise<UserDto> {
    const user = await this.verifyAndFindUser(token);
    if (!user || user.role !== UserRole.ADMIN) {
      throw ExceptionDictionary().AUTHENTICATION_FAILED;
    }
    return user;
  }

  async findUser(email: string): Promise<UserDto> {
    return await this.userService.getUserByEmail(email);
  }

  async verifyAndFindUser(token: string): Promise<UserDto> {
    let email: string;
    try {
      email = verifyToken(token).email;
    } catch (err) {
      throw ExceptionDictionary(err.stack).AUTHENTICATION_FAILED;
    }
    return await this.findUser(email);
  }
}
