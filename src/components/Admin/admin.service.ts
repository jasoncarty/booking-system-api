/* eslint @typescript-eslint/camelcase: 0 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generate } from 'rand-token';

import { User } from './../User/user.entity';
import { UpdateUserAsAdminDto, CreateUserDto, ExceptionDictionary } from '../../proto';
import { AppMailerService } from '../AppMailer/appMailer.service';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly appMailer: AppMailerService,
  ) {}

  async getUser(id: number): Promise<User> {
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

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async createUser(user: CreateUserDto): Promise<User> {
    user.verification_token = generate(40);
    let savedUser: User;
    try {
      savedUser = await this.userRepository.save(user);
    } catch (e) {
      throw ExceptionDictionary.USER_CREATION_ERROR;
    }
    this.sendConfirmationMail(savedUser);
    return savedUser;
  }

  private sendConfirmationMail(user: User): void {
    try {
      this.appMailer.newUserMail(user.email, user.verification_token, user.name);
    } catch (e) {
      throw ExceptionDictionary.EMAIL_SENDING_ERROR;
    }
  }

  async updateUser(id: number, values: UpdateUserAsAdminDto): Promise<User> {
    const user = await this.getUser(id);
    try {
      const userEntity = new User();
      Object.assign(userEntity, values);
      await this.userRepository.update(user.id, userEntity);
      return await this.getUser(user.id);
    } catch (e) {
      throw ExceptionDictionary.USER_UPDATE_ERROR;
    }
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.getUser(id);
    return await this.userRepository.remove(user);
  }
}
