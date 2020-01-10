import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

import { CustomException } from './customException';
import { ErrorCode } from '../dto';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const { message } = error;
    const errorCode =
      error instanceof CustomException ? error.errorCode : ErrorCode.GENERIC;

    const startTime = new Date();
    console.log(
      `[${startTime.toISOString()}] An error occured: at url: ${
        req.url
      }, errorCode: ${errorCode}, errorMessage: ${message}`,
    );
    console.log(error);

    res.json({
      errorCode,
      message,
      stacktrace: error.stack,
      path: req.url,
    });
  }
}
