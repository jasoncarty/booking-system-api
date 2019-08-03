import { LoggingInterceptor } from './../logging.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import * as operators from 'rxjs/operators';

describe('LoggingInterceptor', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
  });

  describe('intercept', () => {
    it('calls next.handle().pipe(tap)', () => {
      const context = ({
        switchToHttp: () => ({
          getRequest: () => ({
            url: 'mock/url/confirmation',
            method: 'GET',
            ip: '127.0.0.1',
            body: {},
            params: {},
          }),
        }),
      } as unknown) as ExecutionContext;

      const pipeSpy = jest.fn();
      const tapSpy = jest.fn();
      const next = ({
        handle: () => ({
          pipe: pipeSpy,
        }),
      } as unknown) as CallHandler;

      let tapArgs: any;
      jest.spyOn(operators, 'tap').mockImplementation(args => {
        tapArgs = args;
        return tapSpy;
      });

      const loggingInterceptor = new LoggingInterceptor();
      loggingInterceptor.intercept(context, next);
      expect(pipeSpy).toHaveBeenCalledTimes(1);
      expect(pipeSpy).toHaveBeenCalledWith(tapSpy);
      tapSpy(tapArgs());
    });
  });

  describe('sanitize', () => {
    it('removes blacklisted items from logs', () => {
      const loggingInterceptor = new LoggingInterceptor();
      expect(
        loggingInterceptor['sanitize']({
          email: 'jason@email.com',
          password: 'qwerty123!',
        }),
      ).toEqual(
        JSON.stringify({
          email: 'jason@email.com',
          password: '[sanitized]',
        }),
      );
    });

    it('removes blacklisted items from logs DEEP', () => {
      const loggingInterceptor = new LoggingInterceptor();
      expect(
        loggingInterceptor['sanitize']({
          email: 'jason@email.com',
          password: 'qwerty123!',
          user: {
            something: {
              email: 'jason@email.com',
              password: 'qwerty123!',
            },
          },
        }),
      ).toEqual(
        JSON.stringify({
          email: 'jason@email.com',
          password: '[sanitized]',
          user: {
            something: {
              email: 'jason@email.com',
              password: '[sanitized]',
            },
          },
        }),
      );
    });
  });
});
