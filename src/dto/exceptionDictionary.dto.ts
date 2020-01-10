import { HttpStatus } from '@nestjs/common';

import { CustomException } from '../utils/customException';
import { ErrorCode } from './errorCode.enum';

const listOfErrors = {
  DUPLICATE_EVENT_ATTENDEE_ERROR: {
    message: 'Cannot create eventAttendee with the same user or event',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },

  EVENT_ATTENDEE_CREATION_ERROR: {
    message: 'An error occured when creating an eventAttendee',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },

  EVENT_ATTENDEE_DELETION_ERROR: {
    message: 'An error occured when deleting an eventAttendee',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },

  EVENT_ATTENDEE_FETCHING_ERROR: {
    message: 'An error occured when fetching the eventAttendees',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },

  EVENT_BOOKING_ERROR: {
    message: 'An error occured when booking an event',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },

  EVENT_CANCEL_ERROR: {
    message: 'An error occured when cancelling an event',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },

  EVENT_CREATION_ERROR: {
    message: 'An error occured when creating an event',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },

  EVENT_FETCHING_ERROR: {
    message: 'An error occured when fetching the events',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },

  EVENT_NOT_FOUND: {
    message: 'Event not found',
    status: HttpStatus.NOT_FOUND,
  },

  USER_NOT_FOUND: {
    message: 'User not found',
    status: HttpStatus.NOT_FOUND,
  },

  USER_CREATION_ERROR: {
    message: 'User creation error',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },

  USER_UPDATE_ERROR: {
    message: 'Update user error',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },

  GENERIC: {
    message: 'An error occured',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },

  NOT_AUTHORIZED: {
    message: 'Not authorized',
    status: HttpStatus.UNAUTHORIZED,
  },

  EMAIL_SENDING_ERROR: {
    message: 'Error sending email',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },

  AUTHENTICATION_FAILED: {
    message: 'Authentication failed',
    status: HttpStatus.UNAUTHORIZED,
  },

  VALIDATION_ERROR: {
    message: 'Validation Error',
    status: HttpStatus.BAD_REQUEST,
  },

  VALIDATION_ERROR_INVALID_EMAIL: {
    message: 'Validation Error: invalid email',
    status: HttpStatus.BAD_REQUEST,
  },

  VALIDATION_ERROR_PASSWORD_STRENGTH: {
    message: 'Validation Error: Password not strong enough',
    status: HttpStatus.BAD_REQUEST,
  },

  USER_DELETION_ERROR_SELF_DELETION: {
    message: 'Cannot delete your own account',
    status: HttpStatus.BAD_REQUEST,
  },

  SETTINGS_NOT_FOUND: {
    message: 'User not found',
    status: HttpStatus.NOT_FOUND,
  },
};

export const ExceptionDictionary = ({
  stack,
  errorCode,
}: {
  stack?: string;
  errorCode: ErrorCode;
}): CustomException => {
  const { message, status } = listOfErrors[errorCode];
  return new CustomException(message, status, ErrorCode[errorCode], stack);
};
