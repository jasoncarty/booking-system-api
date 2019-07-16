import { ExecutionContext, CallHandler } from '@nestjs/common';

import { TimeoutInterceptor } from './../timeout.interceptor';
import * as operators from 'rxjs/operators';

describe('TimeoutInterceptor', () => {
  describe('intercept', () => {
    it('calls next.handle().pipe()', () => {
      const context = ({} as unknown) as ExecutionContext;
      const pipeSpy = jest.fn();
      const timeoutSpy = jest.fn();
      let timeoutArgs: any;
      jest.spyOn(operators, 'timeout').mockImplementationOnce(args => {
        timeoutArgs = args;
        return timeoutSpy;
      });
      const next = ({
        handle: () => ({
          pipe: pipeSpy,
        }),
      } as unknown) as CallHandler;

      const timeoutInterceptor = new TimeoutInterceptor();
      timeoutInterceptor.intercept(context, next);
      expect(pipeSpy).toHaveBeenCalledTimes(1);
      expect(pipeSpy).toHaveBeenCalledWith(timeoutSpy);
      timeoutSpy(timeoutArgs);
    });
  });
});
