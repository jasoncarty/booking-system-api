import { HttpStatus } from '@nestjs/common';

import { CustomException } from './../utils/customException';
import { ErrorCode } from './errorCode.enum';

const getError = (
  errorCode: ErrorCode,
  message?: string,
  status?: HttpStatus,
  stack?: string,
): CustomException => {
  return new CustomException(message, status, errorCode, stack);
};

export class ExceptionDictionary {
  private readonly stack: string;

  constructor(stack?: string) {
    this.stack = stack;
  }

  EVENT_NOT_FOUND = getError(
    ErrorCode.EVENT_NOT_FOUND,
    'User not found',
    HttpStatus.NOT_FOUND,
    this.stack,
  );

  USER_NOT_FOUND = getError(
    ErrorCode.USER_NOT_FOUND,
    'User not found',
    HttpStatus.NOT_FOUND,
    this.stack,
  );

  USER_CREATION_ERROR = getError(
    ErrorCode.USER_CREATION_ERROR,
    'User creation error',
    HttpStatus.INTERNAL_SERVER_ERROR,
    this.stack,
  );

  USER_UPDATE_ERROR = getError(
    ErrorCode.USER_UPDATE_ERROR,
    'Update user error',
    HttpStatus.INTERNAL_SERVER_ERROR,
    this.stack,
  );

  GENERIC = getError(
    ErrorCode.GENERIC,
    'An error occured',
    HttpStatus.INTERNAL_SERVER_ERROR,
    this.stack,
  );

  NOT_AUTHORIZED = getError(
    ErrorCode.NOT_AUTHORIZED,
    'Not authorized',
    HttpStatus.UNAUTHORIZED,
    this.stack,
  );

  EMAIL_SENDING_ERROR = getError(
    ErrorCode.EMAIL_SENDING_ERROR,
    'Error sending email',
    HttpStatus.INTERNAL_SERVER_ERROR,
    this.stack,
  );

  AUTHENTICATION_FAILED = getError(
    ErrorCode.AUTHENTICATION_FAILED,
    'Authentication failed',
    HttpStatus.UNAUTHORIZED,
    this.stack,
  );

  VALIDATION_ERROR = getError(
    ErrorCode.VALIDATION_ERROR,
    'Validation Error',
    HttpStatus.BAD_REQUEST,
    this.stack,
  );

  VALIDATION_ERROR_INVALID_EMAIL = getError(
    ErrorCode.VALIDATION_ERROR_INVALID_EMAIL,
    'Validation Error',
    HttpStatus.BAD_REQUEST,
    this.stack,
  );

  VALIDATION_ERROR_PASSWORD_STRENGTH = getError(
    ErrorCode.VALIDATION_ERROR_PASSWORD_STRENGTH,
    'Validation Error',
    HttpStatus.BAD_REQUEST,
    this.stack,
  );

  USER_DELETION_ERROR_SELF_DELETION = getError(
    ErrorCode.USER_DELETION_ERROR_SELF_DELETION,
    'Cannot delete your own account',
    HttpStatus.BAD_REQUEST,
    this.stack,
  );

  SETTINGS_NOT_FOUND = getError(
    ErrorCode.SETTINGS_NOT_FOUND,
    'User not found',
    HttpStatus.NOT_FOUND,
    this.stack,
  );
}
