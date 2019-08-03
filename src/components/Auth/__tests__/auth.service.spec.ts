import { UserService } from './../../User/user.service';
import { ErrorCode } from '../../../proto';
import * as utils from '../../../utils';
import { AuthService } from '../auth.service';
import {
  appMailer,
  singleUser,
  UserRepositoryMock,
  adminUser,
} from './../../../mocks/index';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(UserRepositoryMock, appMailer);
    authService = new AuthService(userService);
  });

  describe('authenticateUser', () => {
    it('returns the singleUser from verifyAndFindUser', async () => {
      jest.spyOn(authService, 'verifyAndFindUser').mockImplementation(() => singleUser);

      expect(await authService.authenticateUser('a98sfds')).toEqual(await singleUser);
    });

    it('returns null from verifyAndFindUser', async () => {
      jest
        .spyOn(authService, 'verifyAndFindUser')
        .mockImplementation(() => Promise.resolve(null));
      expect(await authService.authenticateUser('a98sfds')).toEqual(null);
    });
  });

  describe('authenticateAdmin', () => {
    it('returns the singleUser from verifyAndFindUser', async () => {
      jest.spyOn(authService, 'verifyAndFindUser').mockImplementation(() => adminUser);

      expect(await authService.authenticateAdmin('a98sfds')).toEqual(await adminUser);
    });

    it('rejects', async () => {
      jest.spyOn(authService, 'verifyAndFindUser').mockImplementation(() => singleUser);

      try {
        await authService.authenticateAdmin('a98sfds');
        throw new Error('test failed');
      } catch (e) {
        expect(e.errorCode).toEqual(ErrorCode.AUTHENTICATION_FAILED);
      }
    });

    it('rejects if verifyAndFindUser returns null', async () => {
      jest
        .spyOn(authService, 'verifyAndFindUser')
        .mockImplementation(() => Promise.resolve(null));

      try {
        await authService.authenticateAdmin('a98sfds');
        throw new Error('test failed');
      } catch (e) {
        expect(e.errorCode).toEqual(ErrorCode.AUTHENTICATION_FAILED);
      }
    });
  });

  describe('findUser', () => {
    it('returns a user', async () => {
      jest.spyOn(userService, 'getUserByEmail').mockImplementation(() => singleUser);

      expect(await authService.findUser('some@email.com')).toEqual(await singleUser);
    });
  });

  describe('verifyAndFindUser', () => {
    it('calls findUser with email as arg', async () => {
      const spy = jest.fn();
      jest.spyOn(authService, 'findUser').mockImplementation(spy);
      jest.spyOn(utils, 'verifyToken').mockImplementation(() => ({
        email: 'some@email.com',
        iat: new Date('2019-01-01'),
        exp: new Date('2019-01-01'),
      }));

      await authService.verifyAndFindUser('some@email.com');
      expect(spy).toHaveBeenCalledWith('some@email.com');
    });

    it('it rejects', async () => {
      jest.spyOn(utils, 'verifyToken').mockImplementation(() => null);

      try {
        await authService.verifyAndFindUser('some@email.com');
        throw new Error('test failed');
      } catch (e) {
        expect(e.errorCode).toEqual(ErrorCode.AUTHENTICATION_FAILED);
      }
    });
  });
});
