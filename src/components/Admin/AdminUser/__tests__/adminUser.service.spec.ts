import { Request } from 'express';

import { AdminService } from '../adminUser.service';
import { UserService } from '../../../Public/User/user.service';
import { ErrorCode } from '../../../../proto';
import {
  appMailer,
  singleUser,
  allUsers,
  updatedUser,
  UserRepositoryMock,
} from '../../../../mocks';

jest.mock('../../../../utils', () => ({
  CustomException: jest.fn(),
  ErrorCode: {
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    GENERIC: 'GENERIC',
    NOT_AUTHORIZED: 'NOT_AUTHORIZED',
  },
  extractToken: jest.fn(),
  verifyToken: () => ({
    email: 'some@email.com',
  }),
}));

const request = ({
  headers: {
    authorization: 'Bearer lkajsdfölkjasdf',
  },
} as unknown) as Request;

const otherUser = {
  ...singleUser,
  id: 2,
};

let adminService: AdminService;
let userService: UserService;

describe('AdminService', () => {
  beforeEach(() => {
    userService = new UserService(UserRepositoryMock, appMailer);
    adminService = new AdminService(UserRepositoryMock, appMailer, userService);
  });

  describe('private getUser', () => {
    it('Finds a user', async () => {
      jest.spyOn(UserRepositoryMock, 'findOne').mockImplementationOnce(() => singleUser);
      const res = await singleUser;
      expect(await adminService['getUser'](1)).toBe(res);
      expect(UserRepositoryMock.findOne).toHaveBeenCalledWith(res.id);
    });

    it('throws a USER_NOT_FOUND exception', async () => {
      jest
        .spyOn(UserRepositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.reject(new Error()));

      try {
        await adminService['getUser'](1);
        throw new Error('test failed');
      } catch (e) {
        expect(e.errorCode).toEqual(ErrorCode.USER_NOT_FOUND);
      }
    });
  });

  describe('getUsers', () => {
    it('returns all users', async () => {
      jest.spyOn(UserRepositoryMock, 'find').mockImplementationOnce(() => allUsers);

      expect(await adminService.getUsers()).toBe(await allUsers);
    });

    it('throws an error', () => {
      const error = new Error('an error');
      jest
        .spyOn(UserRepositoryMock, 'find')
        .mockImplementationOnce(() => Promise.reject(error));

      expect(adminService.getUsers()).rejects.toEqual(error);
    });
  });

  describe('createUser', () => {
    it('returns a created user', async () => {
      jest.spyOn(UserRepositoryMock, 'save').mockImplementationOnce(() => singleUser);

      expect(
        await adminService.createUser({
          name: 'some name',
          email: 'some@email.com',
        }),
      ).toBe(await singleUser);
    });

    it('returns an error', async () => {
      const error = new Error('an error');
      jest
        .spyOn(UserRepositoryMock, 'save')
        .mockImplementationOnce(() => Promise.reject(error));

      try {
        await adminService.createUser({
          name: 'some name',
          email: 'some@email.com',
        });
        throw new Error('test failed');
      } catch (e) {
        expect(e.errorCode).toEqual(ErrorCode.USER_CREATION_ERROR);
      }
    });
  });

  describe('sendConfirmationEmail', () => {
    it('calls appMailer.newUserMail with args', async () => {
      const newUserMailSpy = jest.fn();
      const _user = await singleUser;
      jest.spyOn(appMailer, 'newUserMail').mockImplementationOnce(newUserMailSpy);

      expect(await adminService['sendConfirmationMail'](_user)).toBe(undefined);
      expect(newUserMailSpy).toHaveBeenCalledTimes(1);
      expect(newUserMailSpy).toHaveBeenCalledWith(
        _user.email,
        _user.verification_token,
        _user.name,
      );
    });

    it('throws an error', async () => {
      jest.spyOn(appMailer, 'newUserMail').mockImplementationOnce(() => {
        throw new Error('an error');
      });
      const _user = await singleUser;
      expect(() => adminService['sendConfirmationMail'](_user)).toThrow();
    });
  });

  describe('updateUser', () => {
    it('updates a user', async () => {
      jest.spyOn(UserRepositoryMock, 'findOne').mockImplementation(() => singleUser);
      jest.spyOn(UserRepositoryMock, 'update').mockImplementationOnce(() => updatedUser);

      expect(
        await adminService.updateUser(1, {
          email: 'some@email.com',
          name: 'some name',
        }),
      ).toEqual(await updatedUser);
    });

    it('throws HttpStatus.NOT_FOUND', async () => {
      jest
        .spyOn(UserRepositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(null));

      try {
        await adminService.updateUser(1, {
          email: 'some@email.com',
          name: 'some name',
        });
        throw new Error('test failed');
      } catch (e) {
        expect(e.errorCode).toEqual(ErrorCode.USER_NOT_FOUND);
      }
    });

    it('throws HttpStatus.USER_UPDATE_ERROR', async () => {
      jest.spyOn(UserRepositoryMock, 'findOne').mockImplementationOnce(() => singleUser);
      jest
        .spyOn(UserRepositoryMock, 'update')
        .mockImplementationOnce(() => Promise.reject(new Error('an error')));

      try {
        await adminService.updateUser(1, {
          email: 'some@email.com',
          name: 'some name',
        });
        throw new Error('test failed');
      } catch (e) {
        expect(e.errorCode).toEqual(ErrorCode.USER_UPDATE_ERROR);
      }
    });
  });

  describe('deleteUser', () => {
    it('returns the deleted user', async () => {
      jest.spyOn(userService, 'getProfile').mockImplementationOnce(() => otherUser);
      jest.spyOn(UserRepositoryMock, 'findOne').mockImplementationOnce(() => singleUser);
      jest.spyOn(UserRepositoryMock, 'remove').mockImplementationOnce(() => singleUser);

      expect(await adminService.deleteUser(request.headers.authorization, 1)).toEqual(
        await singleUser,
      );
    });

    it('throws USER_DELETION_ERROR_SELF_DELETION Exception', async () => {
      jest.spyOn(userService, 'getProfile').mockImplementationOnce(() => singleUser);

      try {
        await adminService.deleteUser(request.headers.authorization, 1);
        throw new Error('test failed');
      } catch (e) {
        expect(e.errorCode).toEqual(ErrorCode.USER_DELETION_ERROR_SELF_DELETION);
      }
    });
  });
});
