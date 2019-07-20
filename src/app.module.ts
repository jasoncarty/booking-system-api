import { Module, Scope, OnApplicationBootstrap } from '@nestjs/common';
import { APP_FILTER, APP_PIPE, APP_INTERCEPTOR } from '@nestjs/core';
import { PugAdapter, MailerModule } from '@nest-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { join } from 'path';

import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { UserModule } from './components/User/user.module';
import { HttpExceptionFilter } from './utils/httpExceptionFilter';
import { ValidationPipe } from './utils/validationPipe';
import { AuthModule } from './components/Auth/auth.module';
import { AdminModule } from './components/Admin/admin.module';
import { TimeoutInterceptor, AuthInterceptor, LoggingInterceptor } from './interceptors';
import * as childProcess from 'child_process';
import { promisify } from 'util';

const exec = promisify(childProcess.exec);

const getMailTransport = (configService: ConfigService): object | string => {
  return configService.envConfig.NODE_ENV === 'production'
    ? `smtps://${configService.envConfig.MAIL_EMAIL}:${configService.envConfig.MAIL_PASSWORD}@smtp.gmail.com`
    : {
        streamTransport: true,
      };
};

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<{}> => ({
        type: 'postgres' as 'postgres',
        host: configService.envConfig.DATABASE_HOST,
        port: Number(configService.envConfig.DATABASE_PORT),
        username: configService.envConfig.DATABASE_USERNAME,
        password: configService.envConfig.DATABASE_PASSWORD,
        database: configService.envConfig.DATABASE,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<{}> => ({
        transport: getMailTransport(configService),
        defaults: {
          from: '"nest-modules" <noreply@booking-system.com>',
        },
        template: {
          dir: join(__dirname, 'mailTemplates'),
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
      scope: Scope.REQUEST,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly connection: Connection) {}

  onApplicationBootstrap(): void {
    if (process.env.NODE_ENV === 'test-ci') {
      exec('npm run e2e:test:newTab');
    }
  }
}
