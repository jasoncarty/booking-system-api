import { MiddlewareConsumer } from '@nestjs/common';
import { Connection, ConnectionOptions } from 'typeorm';

import { AppModule } from './../app.module';

jest
  .mock('./../components/User/user.service', () => ({
    UserService: jest.fn(),
  }))
  .mock('./../components/Admin/admin.service', () => ({
    AdminService: jest.fn(),
  }))
  .mock('@nestjs/typeorm', () => ({
    TypeOrmModule: {
      forRootAsync: {
        imports: jest.fn(),
        useFactory: jest.fn(),
      },
      forFeature: jest.fn(),
    },
  }))
  .mock('@nest-modules/mailer', () => ({
    MailerModule: {
      forRootAsync: {
        imports: jest.fn(),
        useFactory: jest.fn(),
      },
    },
  }));

describe('AppModule', () => {
  describe('configure', () => {
    it('configures the module with a middleware', () => {
      const connectionOptions = {
        type: 'postgres' as 'postgres',
        host: 'configService.envConfig.DATABASE_HOST',
        port: 5123,
        username: 'configService.envConfig.DATABASE_USERNAME',
        password: 'configService.envConfig.DATABASE_PASSWORD',
        database: 'configService.envConfig.DATABASE',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
      } as ConnectionOptions;

      const connection = new Connection(connectionOptions);
      const appModule = new AppModule(connection);
      const consumer = ({
        apply: () => ({
          exclude: () => ({
            forRoutes: jest.fn(),
          }),
        }),
      } as unknown) as MiddlewareConsumer;
    });
  });
});
