import { ErrorCode } from '../dto';
import { HttpStatus } from '@nestjs/common';

export class CustomException extends Error {
  constructor(
    public readonly message: string,
    public readonly status: HttpStatus,
    public readonly errorCode: ErrorCode,
    public readonly stack: string,
  ) {
    super();
  }
}
