/* eslint @typescript-eslint/camelcase: 0 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generate } from 'rand-token';

import { User } from '../../Repositories/user.entity';
import { ExceptionDictionary } from '../../proto';
import { AppMailerService } from '../AppMailer/appMailer.service';
import { UserService } from './../User/user.service';
import { UserUpdateDto, UserCreateDto } from './dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly appMailer: AppMailerService,
    private readonly userService: UserService,
  ) {}

  async getUser(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findOne(id);
      if (user) {
        return user;
      }
      throw new Error();
    } catch (err) {
      throw ExceptionDictionary(err.stack).USER_NOT_FOUND;
    }
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async createUser(values: UserCreateDto): Promise<User> {
    const user = {
      ...values,
      verification_token: generate(40),
    };

    let savedUser: User;
    try {
      savedUser = await this.userRepository.save(user);
    } catch (err) {
      throw ExceptionDictionary(err.stack).USER_CREATION_ERROR;
    }
    this.sendConfirmationMail(savedUser);
    return savedUser;
  }

  private sendConfirmationMail(user: User): void {
    try {
      this.appMailer.newUserMail(user.email, user.verification_token, user.name);
    } catch (err) {
      throw ExceptionDictionary(err.stack).EMAIL_SENDING_ERROR;
    }
  }

  async updateUser(id: number, values: UserUpdateDto): Promise<User> {
    const user = await this.getUser(id);
    try {
      const userEntity = new User();
      Object.assign(userEntity, values);
      await this.userRepository.update(user.id, userEntity);
      return await this.getUser(user.id);
    } catch (err) {
      throw ExceptionDictionary(err.stack).USER_UPDATE_ERROR;
    }
  }

  async deleteUser(authHeader: string, id: number): Promise<User> {
    const currentUser = await this.userService.getProfile(authHeader);
    if (currentUser.id === Number(id)) {
      throw ExceptionDictionary().USER_DELETION_ERROR_SELF_DELETION;
    }
    const user = await this.getUser(id);
    return await this.userRepository.remove(user);
  }
}
