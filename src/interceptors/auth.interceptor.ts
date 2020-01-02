import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { map } from 'rxjs/operators';

import { extractToken, createAuthToken } from './../utils';
import { AuthService } from './../components/Auth/auth.service';
import { ExceptionDictionary, ErrorCode } from './../proto';

export const NON_PROTECTED_PATHS = ['authentication', 'verification', 'confirmation'];
export const TEST_ENVS = ['test', 'test-ci'];

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private readonly authService: AuthService) {}

  private blackList: string[] = [
    'password',
    'verification_token',
    'password_reset_token',
  ];

  private shouldAuthenticate(path: string): boolean {
    const parts = path.split('?')[0].split('/');
    return parts.every((part: string): boolean => !NON_PROTECTED_PATHS.includes(part));
  }

  private sanitize(values: object): string | object {
    if (TEST_ENVS.includes(process.env.NODE_ENV)) {
      return values;
    }

    const sanitized = JSON.stringify(values, (key, value): string => {
      if (key && this.blackList.includes(key)) {
        return '[sanitized]';
      }
      return value;
    });
    return JSON.parse(sanitized);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();

    let token: string;
    if (this.shouldAuthenticate(req.path)) {
      let authToken: string;
      if (req.headers.authorization) {
        authToken = extractToken(req.headers.authorization);
      }
      if (!authToken) {
        throw ExceptionDictionary({
          errorCode: ErrorCode.NOT_AUTHORIZED,
        });
      }

      const user = req.path.includes('admin')
        ? await this.authService.authenticateAdmin(authToken)
        : await this.authService.authenticateUser(authToken);
      const { email } = user;
      token = await createAuthToken(email);
    }

    return next.handle().pipe(
      map((data): {} => {
        return {
          data: this.sanitize(data),
          status: HttpStatus.OK,
          token,
        };
      }),
    );
  }
}
