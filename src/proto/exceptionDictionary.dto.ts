import { HttpStatus } from '@nestjs/common';
import { CustomException } from './../utils/customException';
import { ErrorCode } from './errorCode.enum';

const getError = (
  errorCode: ErrorCode,
  message?: string,
  status?: HttpStatus,
): CustomException => {
  return new CustomException(message, status, errorCode);
};

export const ExceptionDictionary = {
  USER_NOT_FOUND: getError(
    ErrorCode.USER_NOT_FOUND,
    'User not found',
    HttpStatus.NOT_FOUND,
  ),
  USER_CREATION_ERROR: getError(
    ErrorCode.USER_CREATION_ERROR,
    'User creation error',
    HttpStatus.INTERNAL_SERVER_ERROR,
  ),
  USER_UPDATE_ERROR: getError(
    ErrorCode.USER_UPDATE_ERROR,
    'Update user error',
    HttpStatus.INTERNAL_SERVER_ERROR,
  ),
  GENERIC: getError(
    ErrorCode.GENERIC,
    'An error occured',
    HttpStatus.INTERNAL_SERVER_ERROR,
  ),
  NOT_AUTHORIZED: getError(
    ErrorCode.NOT_AUTHORIZED,
    'Not authorized',
    HttpStatus.UNAUTHORIZED,
  ),
  EMAIL_SENDING_ERROR: getError(
    ErrorCode.EMAIL_SENDING_ERROR,
    'Error sending email',
    HttpStatus.INTERNAL_SERVER_ERROR,
  ),
  AUTHENTICATION_FAILED: getError(
    ErrorCode.AUTHENTICATION_FAILED,
    'Authentication failed',
    HttpStatus.FORBIDDEN,
  ),
  VALIDATION_ERROR: getError(
    ErrorCode.VALIDATION_ERROR,
    'Validation Error',
    HttpStatus.BAD_REQUEST,
  ),
  VALIDATION_ERROR_INVALID_EMAIL: getError(
    ErrorCode.VALIDATION_ERROR_INVALID_EMAIL,
    'Validation Error',
    HttpStatus.BAD_REQUEST,
  ),
  VALIDATION_ERROR_PASSWORD_STRENGTH: getError(
    ErrorCode.VALIDATION_ERROR_PASSWORD_STRENGTH,
    'Validation Error',
    HttpStatus.BAD_REQUEST,
  ),
  USER_DELETION_ERROR_SELF_DELETION: getError(
    ErrorCode.USER_DELETION_ERROR_SELF_DELETION,
    'Cannot delete your own account',
    HttpStatus.BAD_REQUEST,
  ),
};
