import * as bcryptjs from 'bcryptjs';
import { SelectQueryBuilder } from 'typeorm';

import { ErrorCode } from '../../../../dto';
import {
  UserRepositoryMock,
  SiteSettingsRepositoryMock,
  appMailer,
  mailSentSuccess,
  mockSiteSettings,
  mockUser,
  singleUser,
  updatedUser,
} from '../../../../mocks';
import * as utils from '../../../../utils';
import { SiteSettingsService } from '../../SiteSettings/siteSettings.service';
import { UserService } from '../user.service';
import { User } from './../../../../Repositories/user.entity';

jest.mock('../../../../utils', () => ({
  CustomException: jest.fn(),
  extractToken: jest.fn(),
  verifyToken: () => ({
    email: 'some@email.com',
  }),
  createAuthToken: () => 'mockToken',
  validate: () => jest.fn(),
}));

const baseAttendeesQueryMock = ({
  select: () => ({
    where: () => ({
      getQuery: () => jest.fn(),
      getParameters: () => jest.fn(),
    }),
  }),
} as unknown) as Promise<SelectQueryBuilder<User>>;

const authHeader = 'Bearer fasdf7tasbdfasdfsfd';

let userService: UserService;
let siteSettingsService: SiteSettingsService;

describe('UserService', () => {
  beforeEach(() => {
    siteSettingsService = new SiteSettingsService(SiteSettingsRepositoryMock);
    userService = new UserService(UserRepositoryMock, appMailer, siteSettingsService);
  });

  describe('getUser', () => {
    it('returns a user', async () => {
      jest.spyOn(UserRepositoryMock, 'findOne').mockImplementationOnce(() => singleUser);

      expect(await userService.getUser(1)).toEqual(await singleUser);
    });

    it('loads relations', async () => {
      const findOneSpy = jest
        .spyOn(UserRepositoryMock, 'findOne')
        .mockImplementationOnce(() => singleUser);

      await userService.getUser(1, true);
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['eventAttendees'],
      });
    });

    it('throws a USER_NOT_FOUND exception', async () => {
      jest
        .spyOn(UserRepositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.reject(new Error('an error')));

      try {
        await userService['getUser'](1);
        throw new Error('test failed');
      } catch (error) {
        expect(error.errorCode).toEqual(ErrorCode.USER_NOT_FOUND);
      }
    });

    it('throws a USER_NOT_FOUND exception if findOne returns null', async () => {
      jest
        .spyOn(UserRepositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(null));

      try {
        await userService['getUser'](1);
        throw new Error('test failed');
      } catch (error) {
        expect(error.errorCode).toEqual(ErrorCode.USER_NOT_FOUND);
      }
    });
  });

  describe('baseAttendeesQuery', () => {
    it('returns a baseQuery', async () => {
      jest.spyOn(UserRepositoryMock, 'createQueryBuilder').mockImplementationOnce(
        () =>
          (({
            leftJoinAndSelect: () =>
              Promise.resolve('SELECT users LEFT JOIN eventAttendees'),
          } as unknown) as SelectQueryBuilder<User>),
      );

      expect(await userService.baseAttendeesQuery()).toStrictEqual(
        'SELECT users LEFT JOIN eventAttendees',
      );
    });
  });

  describe('getAttendees', () => {
    it('returns an object with reserves and nonReserves', async () => {
      jest
        .spyOn(userService, 'getReservesAndNonReserves')
        .mockImplementation(() => Promise.resolve([mockUser, mockUser]));

      expect(await userService.getAttendees(1)).toStrictEqual({
        reserves: [mockUser, mockUser],
        nonReserves: [mockUser, mockUser],
      });
      jest.restoreAllMocks();
    });

    it('throws an EVENT_ATTENDEE_FETCHING_ERROR errors', async () => {
      jest
        .spyOn(userService, 'getReservesAndNonReserves')
        .mockImplementationOnce(() => Promise.reject(new Error('sdfasdf')));

      try {
        await userService.getAttendees(1);
        throw new Error('Test failed');
      } catch (err) {
        expect(err.errorCode).toEqual(ErrorCode.EVENT_ATTENDEE_FETCHING_ERROR);
      }
    });
  });

  describe('getNonAttendees', () => {
    it('returns an array of users', async () => {
      jest
        .spyOn(userService, 'baseAttendeesQuery')
        .mockImplementationOnce(() => baseAttendeesQueryMock);

      jest.spyOn(UserRepositoryMock, 'createQueryBuilder').mockImplementationOnce(
        () =>
          (({
            where: () => ({
              orderBy: () => ({
                setParameters: () => ({
                  getMany: () => Promise.resolve([mockUser, mockUser]),
                }),
              }),
            }),
          } as unknown) as SelectQueryBuilder<User>),
      );

      expect(await userService.getNonAttendees(1)).toStrictEqual([mockUser, mockUser]);
    });

    it('throws an EVENT_ATTENDEE_FETCHING_ERROR error', async () => {
      jest
        .spyOn(userService, 'baseAttendeesQuery')
        .mockImplementationOnce(() => baseAttendeesQueryMock);

      jest.spyOn(UserRepositoryMock, 'createQueryBuilder').mockImplementationOnce(
        () =>
          (({
            where: () => ({
              orderBy: () => ({
                setParameters: () => ({
                  getMany: () => Promise.reject(new Error('aksjdflkjas')),
                }),
              }),
            }),
          } as unknown) as SelectQueryBuilder<User>),
      );

      try {
        await userService.getNonAttendees(1);
        throw new Error('Test failed');
      } catch (err) {
        expect(err.errorCode).toEqual(ErrorCode.EVENT_ATTENDEE_FETCHING_ERROR);
      }
    });
  });

  describe('getProfile', () => {
    it('Finds a user', async () => {
      jest.spyOn(userService, 'getUserByEmail').mockImplementationOnce(() => singleUser);
      const res = await singleUser;

      expect(await userService.getProfile(authHeader)).toBe(res);
      expect(userService.getUserByEmail).toHaveBeenCalledWith('some@email.com', false);
    });

    it('throws a USER_NOT_FOUND exception', async () => {
      jest
        .spyOn(UserRepositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(null));

      try {
        await userService.getProfile(authHeader);
        throw new Error('test failed');
      } catch (error) {
        expect(error.errorCode).toEqual(ErrorCode.USER_NOT_FOUND);
      }
    });

    it('throws a AUTHENTICATION_FAILED exception', async () => {
      jest.spyOn(utils, 'verifyToken').mockImplementationOnce(() => null);

      try {
        await userService.getProfile(authHeader);
        throw new Error('test failed');
      } catch (error) {
        expect(error.errorCode).toEqual(ErrorCode.AUTHENTICATION_FAILED);
      }
    });
  });

  describe('getReservesAndNonReserves', () => {
    it('returns an array of UserDto', async () => {
      jest.spyOn(userService, 'baseAttendeesQuery').mockImplementationOnce(
        () =>
          (({
            where: () => ({
              orderBy: () => ({
                getMany: () => [mockUser, mockUser],
              }),
            }),
          } as unknown) as Promise<SelectQueryBuilder<User>>),
      );

      jest.spyOn(UserRepositoryMock, 'createQueryBuilder').mockImplementationOnce(
        () =>
          (({
            where: () => ({
              orderBy: () => ({
                getMany: () => Promise.resolve([mockUser, mockUser]),
              }),
            }),
          } as unknown) as SelectQueryBuilder<User>),
      );

      expect(await userService.getReservesAndNonReserves(1, false)).toStrictEqual([
        mockUser,
        mockUser,
      ]);
    });
  });

  describe('getUserByEmail', () => {
    it('Finds a user', async () => {
      jest.spyOn(UserRepositoryMock, 'findOne').mockImplementationOnce(() => singleUser);
      const res = await singleUser;

      expect(await userService.getUserByEmail('some@email.com')).toBe(res);
      expect(UserRepositoryMock.findOne).toHaveBeenCalledWith({
        relations: null,
        where: { email: 'some@email.com' },
      });
    });

    it('throws a USER_NOT_FOUND exception', async () => {
      jest
        .spyOn(UserRepositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(null));

      try {
        await userService.getUserByEmail('some@email.com');
        throw new Error('test failed');
      } catch (error) {
        expect(error.errorCode).toEqual(ErrorCode.USER_NOT_FOUND);
      }
    });

    it('loads relations', async () => {
      jest.spyOn(UserRepositoryMock, 'findOne').mockImplementationOnce(() => singleUser);
      const res = await singleUser;

      expect(await userService.getUserByEmail('some@email.com', true)).toBe(res);
      expect(UserRepositoryMock.findOne).toHaveBeenCalledWith({
        relations: ['eventAttendees'],
        where: { email: 'some@email.com' },
      });
    });
  });

  describe('updateUser', () => {
    it('Updates a user', async () => {
      jest.spyOn(userService, 'getProfile').mockImplementationOnce(() => singleUser);
      jest.spyOn(UserRepositoryMock, 'update').mockImplementationOnce(() => updatedUser);
      jest.spyOn(UserRepositoryMock, 'findOne').mockImplementationOnce(() => singleUser);

      const res = await updatedUser;
      expect(
        await userService.updateUser(authHeader, {
          name: 'Roger',
          email: 'some@email.com',
          password: 'Qwerty123!',
        }),
      ).toEqual(res);
    });

    it('throws a USER_NOT_FOUND exception', async () => {
      jest
        .spyOn(UserRepositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(null));

      try {
        await userService.updateUser(authHeader, {
          name: 'Roger',
          email: 'some@email.com',
        });
        throw new Error('test failed');
      } catch (error) {
        expect(error.errorCode).toEqual(ErrorCode.USER_NOT_FOUND);
      }
    });

    it('throws a USER_UPDATE_ERROR exception', async () => {
      jest.spyOn(userService, 'getProfile').mockImplementationOnce(() => singleUser);
      jest
        .spyOn(UserRepositoryMock, 'update')
        .mockImplementationOnce(() => Promise.reject(new Error()));

      try {
        await userService.updateUser(authHeader, {
          name: 'Roger',
          email: 'some@email.com',
        });
        throw new Error('test failed');
      } catch (error) {
        expect(error.errorCode).toEqual(ErrorCode.USER_UPDATE_ERROR);
      }
    });
  });

  describe('requestConfirmation', () => {
    it('Adds/updates a verificationCode', async () => {
      jest.spyOn(userService, 'getUserByEmail').mockImplementationOnce(() => singleUser);
      jest.spyOn(UserRepositoryMock, 'update').mockImplementationOnce(() => updatedUser);
      jest
        .spyOn(siteSettingsService, 'getSiteSettings')
        .mockImplementationOnce(() => mockSiteSettings);

      expect(await userService.requestConfirmation({ email: 'some@email.com' })).toEqual({
        mailSent: true,
        details: mailSentSuccess,
      });
    });

    it('throws an error', async () => {
      const error = new Error('A really bad error was thrown');
      jest.spyOn(appMailer, 'newUserMail').mockImplementationOnce(() => {
        throw error;
      });
      jest.spyOn(userService, 'getUserByEmail').mockImplementationOnce(() => singleUser);
      jest.spyOn(UserRepositoryMock, 'update').mockImplementationOnce(() => updatedUser);

      try {
        await userService.requestConfirmation({ email: 'some@email.com' });
        throw new Error('test failed');
      } catch (error) {
        expect(error.errorCode).toEqual(ErrorCode.EMAIL_SENDING_ERROR);
      }
    });
  });

  describe('requestPasswordReset', () => {
    it('Adds/updates a password_reset_token', async () => {
      jest.spyOn(userService, 'getUserByEmail').mockImplementationOnce(() => singleUser);
      jest.spyOn(UserRepositoryMock, 'update').mockImplementationOnce(() => updatedUser);
      jest
        .spyOn(siteSettingsService, 'getSiteSettings')
        .mockImplementationOnce(() => mockSiteSettings);

      expect(await userService.requestPasswordReset({ email: 'some@email.com' })).toEqual(
        {
          mailSent: true,
          details: mailSentSuccess,
        },
      );
    });

    it('throws an error', async () => {
      const error = new Error('A really bad error was thrown');
      jest.spyOn(appMailer, 'newUserMail').mockImplementationOnce(() => {
        throw error;
      });
      jest.spyOn(userService, 'getUserByEmail').mockImplementationOnce(() => singleUser);
      jest.spyOn(UserRepositoryMock, 'update').mockImplementationOnce(() => updatedUser);

      try {
        await userService.requestPasswordReset({ email: 'some@email.com' });
        throw new Error('test failed');
      } catch (error) {
        expect(error.errorCode).toEqual(ErrorCode.EMAIL_SENDING_ERROR);
      }
    });
  });

  describe('confirmAccount', () => {
    it('confirms an account', async () => {
      jest.spyOn(UserRepositoryMock, 'findOne').mockImplementationOnce(() => singleUser);
      jest.spyOn(UserRepositoryMock, 'update').mockImplementationOnce(() => updatedUser);
      jest.spyOn(UserRepositoryMock, 'findOne').mockImplementationOnce(() => singleUser);

      expect(
        await userService.confirmAccount(
          {
            email: 'some@email.com',
            password: 'Qwerty123!',
          },
          'kjlaskjdlfkjasdf',
        ),
      ).toEqual(await singleUser);
    });

    it('throws a USER_NOT_FOUND exception', async () => {
      jest
        .spyOn(UserRepositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(null));

      try {
        await userService.confirmAccount(
          {
            email: 'some@email.com',
            password: 'Qwerty123!',
          },
          'kjlaskjdlfkjasdf',
        );
        throw new Error('test failed');
      } catch (error) {
        expect(error.errorCode).toEqual(ErrorCode.USER_NOT_FOUND);
      }
    });

    it('throws a USER_UPDATE_ERROR exception', async () => {
      jest.spyOn(UserRepositoryMock, 'findOne').mockImplementationOnce(() => singleUser);
      jest
        .spyOn(userService, 'hashPassword')
        .mockImplementationOnce(() => Promise.resolve('lkjadslfkjsadfjk'));
      jest
        .spyOn(UserRepositoryMock, 'update')
        .mockImplementationOnce(() => Promise.reject(new Error()));

      try {
        await userService.confirmAccount(
          {
            email: 'some@email.com',
            password: 'Qwerty123!',
          },
          'kjlaskjdlfkjasdf',
        );
        throw new Error('test failed');
      } catch (error) {
        expect(error.errorCode).toEqual(ErrorCode.USER_UPDATE_ERROR);
      }
    });
  });

  describe('save', () => {
    it('saves a user', async () => {
      jest
        .spyOn(UserRepositoryMock, 'save')
        .mockImplementationOnce(() => Promise.resolve(singleUser));

      expect(await userService.save(await singleUser)).toEqual(await singleUser);
    });
  });

  describe('loginUser', () => {
    it('returns a user object', async () => {
      jest.spyOn(userService, 'getUserByEmail').mockImplementationOnce(() => singleUser);
      jest.spyOn(bcryptjs, 'compare').mockImplementationOnce(() => Promise.resolve(true));

      expect(
        await userService.loginUser({
          email: 'some@email.com',
          password: 'Qwerty123!',
        }),
      ).toEqual({
        user: await singleUser,
        token: 'mockToken',
      });
      expect(userService.getUserByEmail).toHaveBeenCalledTimes(1);
      expect(bcryptjs.compare).toHaveBeenCalledTimes(1);
    });

    it('throws a NOT FOUND exception', async () => {
      jest
        .spyOn(UserRepositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(null));

      try {
        await userService.loginUser({
          email: 'some@email.com',
          password: 'Qwerty123!',
        });
        throw new Error('test failed');
      } catch (error) {
        expect(error.errorCode).toEqual(ErrorCode.USER_NOT_FOUND);
      }
    });

    it('throws a AUTHENTICATION_FAILED exception', async () => {
      jest.spyOn(userService, 'getUserByEmail').mockImplementationOnce(() => singleUser);
      jest
        .spyOn(bcryptjs, 'compare')
        .mockImplementationOnce(() => Promise.resolve(false));

      try {
        await userService.loginUser({
          email: 'some@email.com',
          password: 'Qwerty123!',
        });
        throw new Error('test failed');
      } catch (error) {
        expect(error.errorCode).toEqual(ErrorCode.AUTHENTICATION_FAILED);
      }
    });
  });
});
