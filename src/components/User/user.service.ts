/* eslint @typescript-eslint/camelcase: 0 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hash, genSalt } from 'bcryptjs';
import { generate } from 'rand-token';

import { User } from '../../Repositories/user.entity';
import {
  UserDto,
  UserLoginDto,
  AuthenticatedUserDto,
  ExceptionDictionary,
} from '../../proto';
import { extractToken, verifyToken, createAuthToken, validate } from '../../utils';
import { UserConfirmationValidator, UserUpdateValidator } from './validators';
import { AppMailerService } from '../AppMailer/appMailer.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly appMailer: AppMailerService,
  ) {}

  private async getUser(id: number): Promise<UserDto> {
    try {
      const user = await this.userRepository.findOne(id);
      if (user) {
        return user;
      }
      throw new Error();
    } catch (err) {
      throw ExceptionDictionary.USER_NOT_FOUND;
    }
  }

  async getProfile(authHeader: string): Promise<UserDto> {
    const token = extractToken(authHeader);
    let email: string;

    try {
      email = verifyToken(token).email;
    } catch (e) {
      throw ExceptionDictionary.AUTHENTICATION_FAILED;
    }

    return await this.getUserByEmail(email);
  }

  async getUserByEmail(email: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw ExceptionDictionary.USER_NOT_FOUND;
    }
    return user;
  }

  async updateUser(authHeader: string, values: UserUpdateValidator): Promise<UserDto> {
    await validate(values, UserUpdateValidator);
    const user = await this.getProfile(authHeader);
    const userEntity = new User();
    Object.assign(userEntity, values);
    try {
      await this.userRepository.update(user.id, userEntity);
      return await this.getUser(user.id);
    } catch (e) {
      throw ExceptionDictionary.USER_UPDATE_ERROR;
    }
  }

  async requestConfirmation(email: string): Promise<{}> {
    const user = await this.getUserByEmail(email);
    const userEntity = new User();
    userEntity.verification_token = generate(40);
    await this.userRepository.update(user.id, userEntity);

    try {
      const sentMail = await this.appMailer.newUserMail(
        user.email,
        user.verification_token,
        user.name,
      );
      return {
        mailSent: true,
        details: sentMail,
      };
    } catch (e) {
      throw ExceptionDictionary.EMAIL_SENDING_ERROR;
    }
  }

  /*
  // User or Admin
  async orderResetPassword(values: object): Promise {
    // do some updating here
  }*/

  async confirmAccount(
    values: UserConfirmationValidator,
    verificationToken: string,
  ): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: {
        verification_token: verificationToken,
        email: values.email,
      },
    });
    if (!user) {
      throw ExceptionDictionary.USER_NOT_FOUND;
    }

    await validate(values, UserConfirmationValidator);
    const newValues = {
      password: await this.hashPassword(values.password),
      confirmed: true,
      confirmed_at: new Date(),
    };
    const userEntity = new User();
    Object.assign(userEntity, newValues);

    try {
      await this.userRepository.update(user.id, userEntity);
      return await this.getUser(user.id);
    } catch (e) {
      throw ExceptionDictionary.USER_UPDATE_ERROR;
    }
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }

  async loginUser(data: UserLoginDto): Promise<AuthenticatedUserDto> {
    const user = await this.getUserByEmail(data.email);
    if (await compare(data.password, user.password)) {
      const { email } = user;
      const token = await createAuthToken(email);
      return {
        user: { ...user },
        token,
      };
    }

    throw ExceptionDictionary.NOT_AUTHORIZED;
  }
}
