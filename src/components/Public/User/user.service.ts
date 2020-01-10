/* eslint @typescript-eslint/camelcase: 0 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SelectQueryBuilder } from 'typeorm';
import { Repository } from 'typeorm';
import { compare, hash, genSalt } from 'bcryptjs';
import { generate } from 'rand-token';

import { User } from '../../../Repositories/user.entity';
import { EventAttendee } from '../../../Repositories/eventAttendee.entity';
import { extractToken, verifyToken, createAuthToken } from '../../../utils';
import {
  UserDto,
  ExceptionDictionary,
  AttendeesDto,
  ErrorCode,
  UserConfirmAccountDto,
  UserUpdateDto,
  UserConfirmRequestDto,
  AuthenticationCreateDto,
  AuthenticatedUserDto,
} from '../../../dto';
import { AppMailerService } from '../../AppMailer/appMailer.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly appMailer: AppMailerService,
  ) {}

  async getUser(id: number, loadRelations = false): Promise<UserDto> {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: loadRelations ? ['eventAttendees'] : null,
      });
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

  async baseAttendeesQuery(): Promise<SelectQueryBuilder<User>> {
    return this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect(
        EventAttendee,
        'eventAttendees',
        'users.id = eventAttendees.userId',
      );
  }

  async getAttendees(eventId: number): Promise<AttendeesDto> {
    try {
      return {
        reserves: await this.getReservesAndNonReserves(eventId, true),
        nonReserves: await this.getReservesAndNonReserves(eventId, false),
      };
    } catch (err) {
      throw ExceptionDictionary({
        stack: err.stack,
        errorCode: ErrorCode.EVENT_ATTENDEE_FETCHING_ERROR,
      });
    }
  }

  async getNonAttendees(eventId: number): Promise<UserDto[]> {
    const baseQuery = await this.baseAttendeesQuery();
    const attendeesIdsQuery = baseQuery
      .select('users.id')
      .where('eventAttendees.eventId = :eventId', { eventId });

    try {
      return await this.userRepository
        .createQueryBuilder('users')
        .where(`users.id NOT IN (${attendeesIdsQuery.getQuery()})`)
        .orderBy('users.name', 'ASC')
        .setParameters(attendeesIdsQuery.getParameters())
        .getMany();
    } catch (err) {
      throw ExceptionDictionary({
        stack: err.stack,
        errorCode: ErrorCode.EVENT_ATTENDEE_FETCHING_ERROR,
      });
    }
  }

  async getProfile(authHeader: string, loadRelations = false): Promise<UserDto> {
    const token = extractToken(authHeader);
    let email: string;

    try {
      email = verifyToken(token).email;
    } catch (err) {
      throw ExceptionDictionary({
        stack: err.stack,
        errorCode: ErrorCode.AUTHENTICATION_FAILED,
      });
    }

    return await this.getUserByEmail(email, loadRelations);
  }

  async getReservesAndNonReserves(eventId: number, reserve: boolean): Promise<UserDto[]> {
    const baseQuery = await this.baseAttendeesQuery();
    return await baseQuery
      .where('eventAttendees.eventId = :eventId AND eventAttendees.reserve = :reserve', {
        eventId,
        reserve,
      })
      .orderBy('users.name', 'ASC')
      .getMany();
  }

  async getUserByEmail(email: string, loadRelations = false): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      relations: loadRelations ? ['eventAttendees'] : null,
      where: {
        email,
      },
    });

    if (!user) {
      throw ExceptionDictionary({
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
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
      throw ExceptionDictionary({
        stack: err.stack,
        errorCode: ErrorCode.USER_UPDATE_ERROR,
      });
    }
  }

  async requestConfirmation({ email }: UserConfirmRequestDto): Promise<{}> {
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
    } catch (err) {
      throw ExceptionDictionary({
        stack: err.stack,
        errorCode: ErrorCode.EMAIL_SENDING_ERROR,
      });
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
      throw ExceptionDictionary({
        errorCode: ErrorCode.USER_NOT_FOUND,
      });
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
      throw ExceptionDictionary({
        stack: err.stack,
        errorCode: ErrorCode.USER_UPDATE_ERROR,
      });
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
    const user = await this.getUserByEmail(data.email);
    try {
      if (await compare(data.password, user.password)) {
        const { email } = user;
        const token = await createAuthToken(email);
        // todo:
        // check if user if confirmed
        return {
          user: { ...user },
          token,
        };
      }
      throw new Error('Incorrect password');
    } catch (err) {
      throw ExceptionDictionary({
        stack: err.stack,
        errorCode: ErrorCode.AUTHENTICATION_FAILED,
      });
    }
  }
}
