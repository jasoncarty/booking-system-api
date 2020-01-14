import { Injectable, Scope } from '@nestjs/common';

import { ErrorCode, ExceptionDictionary, UserDto, UserRole } from '../../dto';
import { UserService } from '../Public/User/user.service';
import { verifyToken } from '../../utils';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async authenticateUser(token: string): Promise<UserDto> {
    return await this.verifyAndFindUser(token);
  }

  async authenticateAdmin(token: string): Promise<UserDto> {
    const user = await this.verifyAndFindUser(token);
    if (!user || user.role !== UserRole.ADMIN) {
      throw ExceptionDictionary({
        errorCode: ErrorCode.AUTHENTICATION_FAILED,
      });
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
      throw ExceptionDictionary({
        stack: err.stack,
        errorCode: ErrorCode.AUTHENTICATION_FAILED,
      });
    }
    return await this.findUser(email);
  }
}
