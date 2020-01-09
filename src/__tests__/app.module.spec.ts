import { Connection, ConnectionOptions } from 'typeorm';
import { PugAdapter } from '@nest-modules/mailer';

import {
  AppModule,
  getMailTransport,
  mailerModuleForRootAsyncOptions,
  typeOrmForRootAsyncOptions,
} from './../app.module';
import { ConfigService } from './../config/config.service';

jest
  .mock('./../components/Public/User/user.service', () => ({
    UserService: jest.fn(),
  }))
  .mock('./../components/Admin/AdminUser/adminUser.service', () => ({
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
  describe('constructor', () => {
    it('contructs an instance of AppModule', () => {
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
      expect(appModule).toBeDefined();
      expect(appModule).toBeInstanceOf(AppModule);
    });
  });

  describe('typeOrmForRootAsyncOptions', () => {
    it('returns config for testing environment', async () => {
      const result = await typeOrmForRootAsyncOptions.useFactory(new ConfigService());
      expect(result).toStrictEqual({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '',
        database: 'booking-system-test',
        entities: [
          '/Users/jasoncarty/code/node/booking-system-api/src/**/*.entity{.ts,.js}',
        ],
        synchronize: true,
        logging: null,
      });
    });

    it('returns config for dev environment', async () => {
      const result = await typeOrmForRootAsyncOptions.useFactory(
        new ConfigService('development'),
      );
      expect(result).toStrictEqual({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '',
        database: 'dumped_db',
        entities: [
          '/Users/jasoncarty/code/node/booking-system-api/src/**/*.entity{.ts,.js}',
        ],
        synchronize: true,
        logging: 'all',
      });
    });
  });

  describe('mailerModuleForRootAsyncOptions', () => {
    it('returns config for mailer module', async () => {
      const result = await mailerModuleForRootAsyncOptions.useFactory(
        new ConfigService(),
      );

      expect(result).toStrictEqual({
        transport: { streamTransport: true },
        defaults: { from: '"nest-modules" <noreply@booking-system.com>' },
        template: {
          dir: '/Users/jasoncarty/code/node/booking-system-api/src/mailTemplates',
          adapter: new PugAdapter(),
          options: { strict: true },
        },
      });
    });
  });

  describe('getMailTransport', () => {
    const configServiceDefault = ({
      envConfig: {
        MAIL_EMAIL: 'anEmailAddress@jlaksd.com',
        MAIL_PASSWORD: 'Qwerty123',
        NODE_ENV: 'production',
      },
    } as unknown) as ConfigService;

    it('returns a production value', () => {
      const result = getMailTransport(configServiceDefault);
      expect(result).toBe(
        `smtps://${configServiceDefault.envConfig.MAIL_EMAIL}:${configServiceDefault.envConfig.MAIL_PASSWORD}@smtp.gmail.com`,
      );
    });

    it('returns a non-production value', () => {
      const configServiceDefault = ({
        envConfig: {
          MAIL_EMAIL: 'anEmailAddress@jlaksd.com',
          MAIL_PASSWORD: 'Qwerty123',
          NODE_ENV: 'development',
        },
      } as unknown) as ConfigService;

      const result = getMailTransport(configServiceDefault);
      expect(result).toEqual({
        streamTransport: true,
      });
    });
  });
});
