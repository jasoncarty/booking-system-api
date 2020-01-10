import * as operators from 'rxjs/operators';
import { CallHandler, ExecutionContext } from '@nestjs/common';

import { AuthInterceptor, NON_PROTECTED_PATHS } from './../auth.interceptor';
import { UserRepositoryMock, appMailer, singleUser } from './../../mocks/index';
import { AuthService } from './../../components/Auth/auth.service';
import { ErrorCode } from '../../dto';
import { UserService } from '../../components/Public/User/user.service';

describe('AuthInterceptor', () => {
  let authService: AuthService;
  let userService: UserService;
  let authInterceptor: AuthInterceptor;

  beforeEach(() => {
    userService = new UserService(UserRepositoryMock, appMailer);
    authService = new AuthService(userService);
    authInterceptor = new AuthInterceptor(authService);
  });

  describe('private shouldAuthenticate', () => {
    it('returns true if path = /admin/someting', () => {
      expect(authInterceptor['shouldAuthenticate']('/admin/someting')).toEqual(true);
    });

    it('returns true if path = someting', () => {
      expect(authInterceptor['shouldAuthenticate']('someting')).toEqual(true);
    });

    it('returns true if path = ""', () => {
      expect(authInterceptor['shouldAuthenticate']('')).toEqual(true);
    });

    it('returns true if path = ///', () => {
      expect(authInterceptor['shouldAuthenticate']('///')).toEqual(true);
    });

    it('returns true if path = someting/else', () => {
      expect(authInterceptor['shouldAuthenticate']('someting/else')).toEqual(true);
    });

    NON_PROTECTED_PATHS.forEach(str => {
      it(`returns false if path = /${str}/kjasd/`, () => {
        expect(authInterceptor['shouldAuthenticate'](`/${str}/kjasd/`)).toEqual(false);
      });

      it(`returns false if path = khkjahs/${str}?jasdkjf=kjhasf`, () => {
        expect(
          authInterceptor['shouldAuthenticate'](`khkjahs/${str}?jasdkjf=kjhasf`),
        ).toEqual(false);
      });
    });
  });

  describe('intercept', () => {
    it('calls next.handle().pipe()', async () => {
      const context = ({
        switchToHttp: () => ({
          getRequest: () => ({
            url: 'mock/url/confirmation',
            headers: {
              authorization: 'Bearer uyasdifuyaosdf',
            },
            path: 'mock/url/confirmation',
          }),
        }),
      } as unknown) as ExecutionContext;

      const pipeSpy = jest.fn();
      const next = ({
        handle: () => ({
          pipe: pipeSpy,
        }),
      } as unknown) as CallHandler;
      await authInterceptor.intercept(context, next);
      expect(pipeSpy).toHaveBeenCalledTimes(1);
    });

    it('throws NOT_AUTHORIZED error', async () => {
      const context = ({
        switchToHttp: () => ({
          getRequest: () => ({
            url: 'mock/url',
            headers: {},
            path: 'mock/url',
          }),
        }),
      } as unknown) as ExecutionContext;

      const next = ({
        handle: () => ({
          pipe: jest.fn(),
        }),
      } as unknown) as CallHandler;

      try {
        await authInterceptor.intercept(context, next);
        throw new Error('test failed');
      } catch (e) {
        expect(e.errorCode).toEqual(ErrorCode.NOT_AUTHORIZED);
      }
    });

    it('authenticates a user', async () => {
      const context = ({
        switchToHttp: () => ({
          getRequest: () => ({
            url: 'mock/url',
            headers: {
              authorization: 'Bearer uyasdifuyaosdf',
            },
            path: 'mock/url',
          }),
        }),
      } as unknown) as ExecutionContext;

      const pipeSpy = jest.fn();
      const next = ({
        handle: () => ({
          pipe: pipeSpy,
        }),
      } as unknown) as CallHandler;

      const mapSpy = jest.fn();
      let mapArgs: any;
      jest.spyOn(operators, 'map').mockImplementationOnce(args => {
        mapArgs = args;
        return mapSpy;
      });

      jest
        .spyOn(authService, 'authenticateUser')
        .mockImplementationOnce(() => singleUser);

      await authInterceptor.intercept(context, next);
      expect(pipeSpy).toHaveBeenCalledTimes(1);
      mapSpy(mapArgs({ key: 'value' }));
    });

    it('authenticates a user 2', async () => {
      const context = ({
        switchToHttp: () => ({
          getRequest: () => ({
            url: 'mock/url',
            headers: {
              authorization: 'Bearer uyasdifuyaosdf',
            },
            path: 'mock/url',
          }),
        }),
      } as unknown) as ExecutionContext;

      const pipeSpy = jest.fn();
      const next = ({
        handle: () => ({
          pipe: pipeSpy,
        }),
      } as unknown) as CallHandler;

      const mapSpy = jest.fn();
      let mapArgs: any;
      jest.spyOn(operators, 'map').mockImplementationOnce(args => {
        mapArgs = args;
        return mapSpy;
      });

      jest
        .spyOn(authService, 'authenticateUser')
        .mockImplementationOnce(() => singleUser);

      await authInterceptor.intercept(context, next);
      expect(pipeSpy).toHaveBeenCalledTimes(1);
      mapSpy(mapArgs());
    });

    it('authenticates a user 3', async () => {
      const context = ({
        switchToHttp: () => ({
          getRequest: () => ({
            url: 'mock/url',
            headers: {
              authorization: 'Bearer uyasdifuyaosdf',
            },
            path: 'mock/url',
          }),
        }),
      } as unknown) as ExecutionContext;

      const pipeSpy = jest.fn();
      const next = ({
        handle: () => ({
          pipe: pipeSpy,
        }),
      } as unknown) as CallHandler;

      const mapSpy = jest.fn();
      let mapArgs: any;
      jest.spyOn(operators, 'map').mockImplementationOnce(args => {
        mapArgs = args;
        return mapSpy;
      });

      jest
        .spyOn(authService, 'authenticateUser')
        .mockImplementationOnce(() => singleUser);

      await authInterceptor.intercept(context, next);
      expect(pipeSpy).toHaveBeenCalledTimes(1);
      mapSpy(mapArgs({ password: 'lkjasdlfkjsdf' }));
    });

    it('authenticates an admin', async () => {
      const context = ({
        switchToHttp: () => ({
          getRequest: () => ({
            url: 'mock/url/admin',
            headers: {
              authorization: 'Bearer uyasdifuyaosdf',
            },
            path: 'mock/url/admin',
          }),
        }),
      } as unknown) as ExecutionContext;

      const pipeSpy = jest.fn();
      const next = ({
        handle: () => ({
          pipe: pipeSpy,
        }),
      } as unknown) as CallHandler;

      const mapSpy = jest.fn();
      jest.spyOn(operators, 'map').mockImplementationOnce(mapSpy);

      jest
        .spyOn(authService, 'authenticateAdmin')
        .mockImplementationOnce(() => singleUser);

      await authInterceptor.intercept(context, next);
      expect(pipeSpy).toHaveBeenCalledTimes(1);
      expect(mapSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('private sanitize', () => {
    it('sanitizes sentive data', () => {
      const OLD_ENV = process.env;
      delete process.env.NODE_ENV;

      const data = {
        password: 'asdf8asdf98ahsdf8',
        user: {
          name: 'kaskdfjhasf',
        },
      };

      const response = authInterceptor['sanitize'](data);
      expect(response).toStrictEqual({ ...data, password: '[sanitized]' });
      process.env = OLD_ENV;
    });
  });
});
