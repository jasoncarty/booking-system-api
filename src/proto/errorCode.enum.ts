export enum ErrorCode {
  EVENT_FETCHING_ERROR = 'EVENT_FETCHING_ERROR',
  EVENT_ATTENDEE_CREATION_ERROR = 'EVENT_ATTENDEE_CREATION_ERROR',
  EVENT_ATTENDEE_DELETION_ERROR = 'EVENT_ATTENDEE_DELETION_ERROR',
  DUPLICATE_EVENT_ATTENDEE_ERROR = 'DUPLICATE_EVENT_ATTENDEE_ERROR',
  EVENT_BOOKING_ERROR = 'EVENT_BOOKING_ERROR',
  EVENT_CANCEL_ERROR = 'EVENT_CANCEL_ERROR',
  EVENT_NOT_FOUND = 'EVENT_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_CREATION_ERROR = 'USER_CREATION_ERROR',
  USER_UPDATE_ERROR = 'USER_UPDATE_ERROR',
  USER_DELETION_ERROR_SELF_DELETION = 'USER_DELETION_ERROR_SELF_DELETION',
  GENERIC = 'GENERIC',
  NOT_AUTHORIZED = 'NOT_AUTHORIZED',
  EMAIL_SENDING_ERROR = 'EMAIL_SENDING_ERROR',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  VALIDATION_ERROR_INVALID_EMAIL = 'VALIDATION_ERROR_INVALID_EMAIL',
  VALIDATION_ERROR_PASSWORD_STRENGTH = 'VALIDATION_ERROR_PASSWORD_STRENGTH',
  SETTINGS_NOT_FOUND = 'SETTINGS_NOT_FOUND',
}
