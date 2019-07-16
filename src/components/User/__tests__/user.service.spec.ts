import * as bcryptjs from 'bcryptjs';

import { UserService } from '../user.service';
import { ExceptionDictionary } from './../../../proto';
import { UserUpdateValidator } from '../validators';
import * as utils from './../../../utils';
import {
  appMailer,
  singleUser,
  updatedUser,
  repositoryMock,
  mailSentSuccess,
} from './../../../mocks';

jest.mock('../../../utils', () => ({
  CustomException: jest.fn(),
  extractToken: jest.fn(),
  verifyToken: () => ({
    email: 'some@email.com',
  }),
  createAuthToken: () => 'mockToken',
  validate: () => jest.fn(),
}));

const authHeader = 'Bearer fasdf7tasbdfasdfsfd';
const userNotFoundException = ExceptionDictionary.USER_NOT_FOUND;
const updateUserException = ExceptionDictionary.USER_UPDATE_ERROR;
const emailSendingException = ExceptionDictionary.EMAIL_SENDING_ERROR;
const notAuthorizedException = ExceptionDictionary.NOT_AUTHORIZED;
const authFailedException = ExceptionDictionary.AUTHENTICATION_FAILED;

let userService: UserService;

describe('UserService', () => {
  beforeEach(() => {
    userService = new UserService(repositoryMock, appMailer);
  });

  describe('private getUser', () => {
    it('returns a user', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockImplementationOnce(() => singleUser);

      expect(await userService['getUser'](1)).toEqual(await singleUser);
    });

    it('throws a USER_NOT_FOUND exception', () => {
      jest
        .spyOn(repositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.reject(new Error('an error')));

      expect(userService['getUser'](1)).rejects.toEqual(userNotFoundException);
    });

    it('throws a USER_NOT_FOUND exception if findOne returns null', () => {
      jest
        .spyOn(repositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(null));

      expect(userService['getUser'](1)).rejects.toEqual(userNotFoundException);
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
        .spyOn(repositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(null));

      expect(userService.getProfile(authHeader)).rejects.toEqual(userNotFoundException);
    });

    it('throws a AUTHENTICATION_FAILED exception', async () => {
      jest.spyOn(utils, 'verifyToken').mockImplementationOnce(() => null);

      expect(userService.getProfile(authHeader)).rejects.toEqual(authFailedException);
    });
  });

  describe('getUserByEmail', () => {
    it('Finds a user', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockImplementationOnce(() => singleUser);
      const res = await singleUser;

      expect(await userService.getUserByEmail('some@email.com')).toBe(res);
      expect(repositoryMock.findOne).toHaveBeenCalledWith({
        where: { email: 'some@email.com' },
      });
    });

    it('throws a USER_NOT_FOUND exception', () => {
      jest
        .spyOn(repositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(null));

      expect(userService.getUserByEmail('some@email.com')).rejects.toEqual(
        userNotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    it('Updates a user', async () => {
      jest.spyOn(userService, 'getProfile').mockImplementationOnce(() => singleUser);
      jest.spyOn(repositoryMock, 'update').mockImplementationOnce(() => updatedUser);
      jest.spyOn(repositoryMock, 'findOne').mockImplementationOnce(() => singleUser);

      const res = await updatedUser;
      expect(
        await userService.updateUser(authHeader, {
          name: 'Roger',
          email: 'some@email.com',
        } as UserUpdateValidator),
      ).toEqual(res);
    });

    it('throws a USER_NOT_FOUND exception', async () => {
      jest
        .spyOn(repositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(null));

      expect(
        userService.updateUser(authHeader, {
          name: 'Roger',
          email: 'some@email.com',
        } as UserUpdateValidator),
      ).rejects.toEqual(userNotFoundException);
    });

    it('throws a USER_UPDATE_ERROR exception', async () => {
      jest.spyOn(userService, 'getProfile').mockImplementationOnce(() => singleUser);
      jest
        .spyOn(repositoryMock, 'update')
        .mockImplementationOnce(() => Promise.reject(new Error()));

      expect(
        userService.updateUser(authHeader, {
          name: 'Roger',
          email: 'some@email.com',
        } as UserUpdateValidator),
      ).rejects.toEqual(updateUserException);
    });
  });

  describe('requestConfirmation', () => {
    it('Adds/updates a verificationCode', async () => {
      jest.spyOn(userService, 'getUserByEmail').mockImplementationOnce(() => singleUser);
      jest.spyOn(repositoryMock, 'update').mockImplementationOnce(() => updatedUser);

      expect(await userService.requestConfirmation('some@email.com')).toEqual({
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
      jest.spyOn(repositoryMock, 'update').mockImplementationOnce(() => updatedUser);

      expect(userService.requestConfirmation('some@email.com')).rejects.toEqual(
        emailSendingException,
      );
    });
  });

  describe('confirmAccount', () => {
    it('confirms an account', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockImplementationOnce(() => singleUser);
      jest.spyOn(repositoryMock, 'update').mockImplementationOnce(() => updatedUser);
      jest.spyOn(repositoryMock, 'findOne').mockImplementationOnce(() => singleUser);

      expect(
        await userService.confirmAccount(
          {
            email: 'some@email.com',
            password: 'qwerty123',
          },
          'kjlaskjdlfkjasdf',
        ),
      ).toEqual(await singleUser);
    });

    it('throws a USER_NOT_FOUND exception', () => {
      jest
        .spyOn(repositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(null));

      expect(
        userService.confirmAccount(
          {
            email: 'some@email.com',
            password: 'qwerty123',
          },
          'kjlaskjdlfkjasdf',
        ),
      ).rejects.toEqual(userNotFoundException);
    });

    it('throws a USER_UPDATE_ERROR exception', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockImplementationOnce(() => singleUser);
      jest
        .spyOn(userService, 'hashPassword')
        .mockImplementationOnce(() => Promise.resolve('lkjadslfkjsadfjk'));
      jest
        .spyOn(repositoryMock, 'update')
        .mockImplementationOnce(() => Promise.reject(new Error()));

      expect(
        userService.confirmAccount(
          {
            email: 'some@email.com',
            password: 'qwerty123',
          },
          'kjlaskjdlfkjasdf',
        ),
      ).rejects.toEqual(updateUserException);
    });
  });

  describe('loginUser', () => {
    it('returns a user object', async () => {
      jest.spyOn(userService, 'getUserByEmail').mockImplementationOnce(() => singleUser);
      jest.spyOn(bcryptjs, 'compare').mockImplementationOnce(() => Promise.resolve(true));

      expect(
        await userService.loginUser({
          email: 'some@email.com',
          password: 'qwerty123',
        }),
      ).toEqual({
        user: await singleUser,
        token: 'mockToken',
      });
      expect(userService.getUserByEmail).toHaveBeenCalledTimes(1);
      expect(bcryptjs.compare).toHaveBeenCalledTimes(1);
    });

    it('throws a NOT FOUND exception', () => {
      jest
        .spyOn(repositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(null));

      expect(
        userService.loginUser({
          email: 'some@email.com',
          password: 'qwerty123',
        }),
      ).rejects.toEqual(userNotFoundException);
    });

    it('throws a NOT AUTHORIZED exception', () => {
      jest.spyOn(userService, 'getUserByEmail').mockImplementationOnce(() => singleUser);
      jest
        .spyOn(bcryptjs, 'compare')
        .mockImplementationOnce(() => Promise.resolve(false));

      expect(
        userService.loginUser({
          email: 'some@email.com',
          password: 'qwerty123',
        }),
      ).rejects.toEqual(notAuthorizedException);
    });
  });
});
