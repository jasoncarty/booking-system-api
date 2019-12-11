import { ExecutionContext, CallHandler } from '@nestjs/common';
import * as operators from 'rxjs/operators';

import { UserService } from './../../components/User/user.service';
import { AuthService } from './../../components/Auth/auth.service';
import { AuthInterceptor, NON_PROTECTED_PATHS } from './../auth.interceptor';
import { ErrorCode } from './../../proto';
import { singleUser, UserRepositoryMock, appMailer } from './../../mocks/index';

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
});
