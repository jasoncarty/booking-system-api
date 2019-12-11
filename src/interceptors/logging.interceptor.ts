import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private blackList: string[] = [
    'password',
    'verification_token',
    'password_reset_token',
  ];

  private sanitize(values: object): string {
    return JSON.stringify(values, (key, value): string => {
      if (key && this.blackList.includes(key)) {
        return '[sanitized]';
      }
      return value;
    });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const startTime = new Date();
    console.log(
      `[${startTime.toISOString()}] IP address: ${req.ip} - Receiving ${
        req.method
      } request to url: ${req.url}, with body: ${this.sanitize(
        req.body,
      )}, with params: ${this.sanitize(req.params)}`,
    );

    return next.handle().pipe(
      tap((): void => {
        const endTime = new Date();
        console.log(
          `[${endTime.toISOString()}] Responding with status ${HttpStatus.OK} from url: ${
            req.url
          }`,
        );
      }),
    );
  }
}
