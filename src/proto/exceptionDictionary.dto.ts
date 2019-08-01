import { HttpStatus } from '@nestjs/common';

import { CustomException } from './../utils/customException';
import { ErrorCode } from './errorCode.enum';
import { ExceptionDictionaryObject } from './ExceptionDictionaryObj.dto';

const getError = (
  errorCode: ErrorCode,
  message?: string,
  status?: HttpStatus,
  stack?: string,
): CustomException => {
  return new CustomException(message, status, errorCode, stack);
};

export const ExceptionDictionary = (stack?: string): ExceptionDictionaryObject => ({
  USER_NOT_FOUND: getError(
    ErrorCode.USER_NOT_FOUND,
    'User not found',
    HttpStatus.NOT_FOUND,
    stack,
  ),
  USER_CREATION_ERROR: getError(
    ErrorCode.USER_CREATION_ERROR,
    'User creation error',
    HttpStatus.INTERNAL_SERVER_ERROR,
    stack,
  ),
  USER_UPDATE_ERROR: getError(
    ErrorCode.USER_UPDATE_ERROR,
    'Update user error',
    HttpStatus.INTERNAL_SERVER_ERROR,
    stack,
  ),
  GENERIC: getError(
    ErrorCode.GENERIC,
    'An error occured',
    HttpStatus.INTERNAL_SERVER_ERROR,
    stack,
  ),
  NOT_AUTHORIZED: getError(
    ErrorCode.NOT_AUTHORIZED,
    'Not authorized',
    HttpStatus.UNAUTHORIZED,
    stack,
  ),
  EMAIL_SENDING_ERROR: getError(
    ErrorCode.EMAIL_SENDING_ERROR,
    'Error sending email',
    HttpStatus.INTERNAL_SERVER_ERROR,
    stack,
  ),
  AUTHENTICATION_FAILED: getError(
    ErrorCode.AUTHENTICATION_FAILED,
    'Authentication failed',
    HttpStatus.FORBIDDEN,
    stack,
  ),
  VALIDATION_ERROR: getError(
    ErrorCode.VALIDATION_ERROR,
    'Validation Error',
    HttpStatus.BAD_REQUEST,
    stack,
  ),
  VALIDATION_ERROR_INVALID_EMAIL: getError(
    ErrorCode.VALIDATION_ERROR_INVALID_EMAIL,
    'Validation Error',
    HttpStatus.BAD_REQUEST,
    stack,
  ),
  VALIDATION_ERROR_PASSWORD_STRENGTH: getError(
    ErrorCode.VALIDATION_ERROR_PASSWORD_STRENGTH,
    'Validation Error',
    HttpStatus.BAD_REQUEST,
    stack,
  ),
  USER_DELETION_ERROR_SELF_DELETION: getError(
    ErrorCode.USER_DELETION_ERROR_SELF_DELETION,
    'Cannot delete your own account',
    HttpStatus.BAD_REQUEST,
    stack,
  ),
});
