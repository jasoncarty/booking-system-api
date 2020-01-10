import { CustomException } from './../customException';
import { ErrorCode } from '../../dto';
import { HttpStatus } from '@nestjs/common';

describe('CustomException', () => {
  describe('constructor', () => {
    it('constructs', () => {
      const customException = new CustomException(
        'User not found',
        HttpStatus.NOT_FOUND,
        ErrorCode.USER_NOT_FOUND,
        'User was not found',
      );

      expect(customException.message).toEqual('User not found');
      expect(customException.status).toEqual(HttpStatus.NOT_FOUND);
      expect(customException.errorCode).toEqual(ErrorCode.USER_NOT_FOUND);
    });
  });
});
