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
import { ExceptionDictionary } from './../proto/exceptionDictionary.dto';

export const NON_PROTECTED_PATHS = ['authentication', 'verification', 'confirmation'];

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
        throw new ExceptionDictionary().NOT_AUTHORIZED;
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
          data,
          status: HttpStatus.OK,
          token,
        };
      }),
    );
  }
}
