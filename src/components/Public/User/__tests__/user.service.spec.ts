import * as bcryptjs from 'bcryptjs';

import { UserService } from '../user.service';
import { ErrorCode } from '../../../../proto';
import * as utils from '../../../../utils';
import {
  appMailer,
  singleUser,
  updatedUser,
  UserRepositoryMock,
  mailSentSuccess,
} from '../../../../mocks';

jest.mock('../../../../utils', () => ({
  CustomException: jest.fn(),
  extractToken: jest.fn(),
  verifyToken: () => ({
    email: 'some@email.com',
  }),
  createAuthToken: () => 'mockToken',
  validate: () => jest.fn(),
}));

const authHeader = 'Bearer fasdf7tasbdfasdfsfd';

let userService: UserService;

describe('UserService', () => {
  beforeEach(() => {
    userService = new UserService(UserRepositoryMock, appMailer);
  });

  describe('private getUser', () => {
    it('returns a user', async () => {
      jest.spyOn(UserRepositoryMock, 'findOne').mockImplementationOnce(() => singleUser);

      expect(await userService['getUser'](1)).toEqual(await singleUser);
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

  describe('getProfile', () => {
    it('Finds a user', async () => {
      jest.spyOn(userService, 'getUserByEmail').mockImplementationOnce(() => singleUser);
      const res = await singleUser;

      expect(await userService.getProfile(authHeader)).toBe(res);
      expect(userService.getUserByEmail).toHaveBeenCalledWith('some@email.com');
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

  describe('getUserByEmail', () => {
    it('Finds a user', async () => {
      jest.spyOn(UserRepositoryMock, 'findOne').mockImplementationOnce(() => singleUser);
      const res = await singleUser;

      expect(await userService.getUserByEmail('some@email.com')).toBe(res);
      expect(UserRepositoryMock.findOne).toHaveBeenCalledWith({
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
