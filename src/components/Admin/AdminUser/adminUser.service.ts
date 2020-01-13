/* eslint @typescript-eslint/camelcase: 0 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generate } from 'rand-token';

import { User } from '../../../Repositories/user.entity';
import { AppMailerService } from '../../AppMailer/appMailer.service';
import { UserService } from '../../Public/User/user.service';
import { SiteSettingsService } from '../../Public/SiteSettings/siteSettings.service';
import {
  AdminUserUpdateDto,
  AdminUserCreateDto,
  ExceptionDictionary,
  ErrorCode,
  UserResponse,
} from '../../../dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly appMailer: AppMailerService,
    private readonly userService: UserService,
    private readonly siteSettingsService: SiteSettingsService,
  ) {}

  async getUser(id: number): Promise<UserResponse> {
    try {
      const user = await this.userRepository.findOne(id);
      if (user) {
        return user;
      }
      throw new Error();
    } catch (err) {
      throw ExceptionDictionary({
        stack: err.stack,
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
    }
  }

  async getUsers(): Promise<UserResponse[]> {
    return await this.userRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  async createUser(values: AdminUserCreateDto): Promise<UserResponse> {
    const user = {
      ...values,
      verification_token: generate(40),
    };

    let savedUser: User;
    try {
      savedUser = await this.userRepository.save(user);
    } catch (err) {
      throw ExceptionDictionary({
        stack: err.stack,
        errorCode: ErrorCode.USER_CREATION_ERROR,
      });
    }
    this.sendConfirmationMail(savedUser);
    return savedUser;
  }

  private async sendConfirmationMail(user: User): Promise<void> {
    try {
      const siteName = (await this.siteSettingsService.getSiteSettings()).site_name;
      await this.appMailer.newUserMail({
        to: user.email,
        verificationToken: user.verification_token,
        userName: user.name,
        siteName,
      });
    } catch (err) {
      throw ExceptionDictionary({
        stack: err.stack,
        errorCode: ErrorCode.EMAIL_SENDING_ERROR,
      });
    }
  }

  async updateUser(id: number, values: AdminUserUpdateDto): Promise<UserResponse> {
    const user = await this.getUser(id);
    try {
      const userEntity = new User();
      Object.assign(userEntity, values);
      await this.userRepository.update(user.id, userEntity);
      return this.getUser(user.id);
    } catch (err) {
      throw ExceptionDictionary({
        stack: err.stack,
        errorCode: ErrorCode.USER_UPDATE_ERROR,
      });
    }
  }

  async deleteUser(authHeader: string, id: number): Promise<UserResponse> {
    const currentUser = await this.userService.getProfile(authHeader);
    if (currentUser.id === Number(id)) {
      throw ExceptionDictionary({
        errorCode: ErrorCode.USER_DELETION_ERROR_SELF_DELETION,
      });
    }
    const user = await this.userRepository.findOne(id);
    return this.userRepository.remove(user);
  }
}
