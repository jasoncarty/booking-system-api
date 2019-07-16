import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../proto';

export class CustomException extends Error {
  constructor(
    public readonly message: string,
    public readonly status: HttpStatus,
    public readonly errorCode: ErrorCode,
  ) {
    super();
  }
}
