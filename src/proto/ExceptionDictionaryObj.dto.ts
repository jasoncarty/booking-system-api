import { ErrorCode } from './errorCode.enum';

export type ExceptionDictionaryObject = { [K in keyof typeof ErrorCode]: any };
