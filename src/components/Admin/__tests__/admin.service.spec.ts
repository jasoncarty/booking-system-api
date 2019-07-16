import { AdminService } from './../admin.service';
import {
  CreateUserDto,
  UpdateUserAsAdminDto,
  ExceptionDictionary,
} from './../../../proto';
import {
  appMailer,
  singleUser,
  allUsers,
  updatedUser,
  repositoryMock,
} from './../../../mocks';

jest.mock('../../../utils', () => ({
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

const userNotFoundException = ExceptionDictionary.USER_NOT_FOUND;
const userCreationException = ExceptionDictionary.USER_CREATION_ERROR;
const userUpdateException = ExceptionDictionary.USER_UPDATE_ERROR;

let adminService: AdminService;

describe('AdminService', () => {
  beforeEach(() => {
    adminService = new AdminService(repositoryMock, appMailer);
  });

  describe('private getUser', () => {
    it('Finds a user', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockImplementationOnce(() => singleUser);
      const res = await singleUser;
      expect(await adminService['getUser'](1)).toBe(res);
      expect(repositoryMock.findOne).toHaveBeenCalledWith(res.id);
    });

    it('throws a CustomException', () => {
      jest
        .spyOn(repositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.reject(new Error()));
      expect(adminService['getUser'](1)).rejects.toEqual(userNotFoundException);
    });
  });

  describe('getUsers', () => {
    it('returns all users', async () => {
      jest.spyOn(repositoryMock, 'find').mockImplementationOnce(() => allUsers);

      expect(await adminService.getUsers()).toBe(await allUsers);
    });

    it('throws an error', () => {
      const error = new Error('an error');
      jest
        .spyOn(repositoryMock, 'find')
        .mockImplementationOnce(() => Promise.reject(error));

      expect(adminService.getUsers()).rejects.toEqual(error);
    });
  });

  describe('createUser', () => {
    it('returns a created user', async () => {
      jest.spyOn(repositoryMock, 'save').mockImplementationOnce(() => singleUser);

      expect(
        await adminService.createUser({
          name: 'some name',
          email: 'some@email.com',
        } as CreateUserDto),
      ).toBe(await singleUser);
    });

    it('returns an error', () => {
      const error = new Error('an error');
      jest
        .spyOn(repositoryMock, 'save')
        .mockImplementationOnce(() => Promise.reject(error));

      expect(
        adminService.createUser({
          name: 'some name',
          email: 'some@email.com',
        } as CreateUserDto),
      ).rejects.toEqual(userCreationException);
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
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => singleUser);
      jest.spyOn(repositoryMock, 'update').mockImplementationOnce(() => updatedUser);

      expect(
        await adminService.updateUser(1, {
          email: 'some@email.com',
          name: 'some name',
        } as UpdateUserAsAdminDto),
      ).toEqual(await updatedUser);
    });

    it('throws HttpStatus.NOT_FOUND', () => {
      jest
        .spyOn(repositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(null));

      expect(
        adminService.updateUser(1, {
          email: 'some@email.com',
          name: 'some name',
        } as UpdateUserAsAdminDto),
      ).rejects.toEqual(userNotFoundException);
    });

    it('throws HttpStatus.INTERNAL_SERVER_ERROR', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockImplementationOnce(() => singleUser);
      jest
        .spyOn(repositoryMock, 'update')
        .mockImplementationOnce(() => Promise.reject(new Error('an error')));

      expect(
        adminService.updateUser(1, {
          email: 'some@email.com',
          name: 'some name',
        } as UpdateUserAsAdminDto),
      ).rejects.toEqual(userUpdateException);
    });
  });

  describe('deleteUser', () => {
    it('returns the deleted user', async () => {
      jest.spyOn(repositoryMock, 'findOne').mockImplementationOnce(() => singleUser);
      jest.spyOn(repositoryMock, 'remove').mockImplementationOnce(() => singleUser);

      expect(await adminService.deleteUser(1)).toEqual(await singleUser);
    });
  });
});
