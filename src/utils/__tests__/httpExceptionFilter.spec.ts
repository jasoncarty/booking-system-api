import { ArgumentsHost, HttpStatus } from '@nestjs/common';

import { HttpExceptionFilter } from './../httpExceptionFilter';
import { CustomException } from './../customException';
import { ErrorCode } from '../../proto';

let httpExceptionFilter: HttpExceptionFilter;

describe('HttpExceptionFilter', () => {
  beforeEach(() => {
    httpExceptionFilter = new HttpExceptionFilter();
  });

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
  });

  describe('catch', () => {
    it('calls request.json with options', () => {
      const error = new Error('mock error');
      const mockJsonFn = jest.fn();
      const response = {
        json: mockJsonFn,
      };

      const host = ({
        switchToHttp: () => ({
          getResponse: () => response,
          getRequest: () => ({ url: 'mock/url' }),
        }),
      } as unknown) as ArgumentsHost;

      httpExceptionFilter.catch(error, host);
      expect(mockJsonFn).toHaveBeenCalledWith({
        errorCode: ErrorCode.GENERIC,
        message: 'mock error',
        stacktrace: error.stack,
        path: 'mock/url',
      });
    });

    it('calls request.json with CustomException options', () => {
      const userNotFoundException = new CustomException(
        'User not found',
        HttpStatus.NOT_FOUND,
        ErrorCode.USER_NOT_FOUND,
      );

      const mockJsonFn = jest.fn();
      const response = {
        json: mockJsonFn,
      };

      const host = ({
        switchToHttp: () => ({
          getResponse: () => response,
          getRequest: () => ({ url: 'mock/url' }),
        }),
      } as unknown) as ArgumentsHost;

      httpExceptionFilter.catch(userNotFoundException, host);
      expect(mockJsonFn).toHaveBeenCalledWith({
        errorCode: ErrorCode.USER_NOT_FOUND,
        message: 'User not found',
        stacktrace: userNotFoundException.stack,
        path: 'mock/url',
      });
    });
  });
});
