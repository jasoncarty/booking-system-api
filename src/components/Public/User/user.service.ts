/* eslint @typescript-eslint/camelcase: 0 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare, hash, genSalt } from 'bcryptjs';
import { generate } from 'rand-token';

import { User } from '../../../Repositories/user.entity';
import { UserDto, ExceptionDictionary } from '../../../proto';
import { extractToken, verifyToken, createAuthToken } from '../../../utils';
import { UserConfirmAccountDto, UserUpdateDto, UserConfirmRequestDto } from './dto';
import { AppMailerService } from '../../AppMailer/appMailer.service';
import { AuthenticationCreateDto, AuthenticatedUserDto } from '../../Auth/dto';

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
      throw new ExceptionDictionary(err.stack).USER_NOT_FOUND;
    }
  }

  async getProfile(authHeader: string, loadRelations = false): Promise<UserDto> {
    const token = extractToken(authHeader);
    let email: string;

    try {
      email = verifyToken(token).email;
    } catch (err) {
      throw new ExceptionDictionary(err.stack).AUTHENTICATION_FAILED;
    }

    return await this.getUserByEmail({ email, loadRelations });
  }

  private async loadUser({
    email,
    loadRelations,
    loadPassword,
  }: {
    email: string;
    loadRelations: boolean;
    loadPassword: boolean;
  }): Promise<UserDto> {
    let selectParams = ['users.id', 'users.email', 'users.name'];
    if (loadPassword) {
      selectParams.push('users.password');
    }

    return loadRelations
      ? await this.userRepository
          .createQueryBuilder()
          .leftJoinAndSelect('eventAttendees', 'eventAttendees')
          .select(selectParams)
          .where('email = :email', { email })
          .getOne()
      : await this.userRepository
          .createQueryBuilder('users')
          .select(selectParams)
          .where('email = :email', { email })
          .getOne();
  }

  async getUserByEmail({
    email,
    loadRelations,
    loadPassword,
  }: {
    email: string;
    loadRelations?: boolean;
    loadPassword?: boolean;
  }): Promise<UserDto> {
    const user = await this.loadUser({ email, loadRelations, loadPassword });

    if (!user) {
      throw new ExceptionDictionary().USER_NOT_FOUND;
    }
    return user;
  }

  async updateUser(authHeader: string, values: UserUpdateDto): Promise<UserDto> {
    const user = await this.getProfile(authHeader);
    const userEntity = new User();
    let newValues: object;
    if (values.password) {
      newValues = {
        ...values,
        password: await this.hashPassword(values.password),
      };
    } else {
      newValues = { ...values };
    }
    Object.assign(userEntity, newValues);
    try {
      await this.userRepository.update(user.id, userEntity);
      return await this.getUser(user.id);
    } catch (err) {
      throw new ExceptionDictionary(err.stack).USER_UPDATE_ERROR;
    }
  }

  async requestConfirmation({ email }: UserConfirmRequestDto): Promise<{}> {
    const user = await this.getUserByEmail({ email });
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
    } catch (err) {
      throw new ExceptionDictionary(err.stack).EMAIL_SENDING_ERROR;
    }
  }

  /*
  // User or Admin
  async orderResetPassword(values: object): Promise {
    // do some updating here
  }*/

  async confirmAccount(
    values: UserConfirmAccountDto,
    verificationToken: string,
  ): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: {
        verification_token: verificationToken,
        email: values.email,
      },
    });
    if (!user) {
      throw new ExceptionDictionary().USER_NOT_FOUND;
    }

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
    } catch (err) {
      throw new ExceptionDictionary(err.stack).USER_UPDATE_ERROR;
    }
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }

  async save(user: UserDto): Promise<UserDto> {
    return await this.userRepository.save(user);
  }

  async loginUser(data: AuthenticationCreateDto): Promise<AuthenticatedUserDto> {
    const user = await this.getUserByEmail({ email: data.email, loadPassword: true });
    try {
      if (await compare(data.password, user.password)) {
        const { email, id, name } = user;
        const token = await createAuthToken(email);
        // todo:
        // check if user if confirmed
        return {
          user: {
            id,
            email,
            name,
          },
          token,
        };
      }
      throw new Error('Incorrect password');
    } catch (err) {
      throw new ExceptionDictionary(err.stack).AUTHENTICATION_FAILED;
    }
  }
}
