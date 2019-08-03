import { Connection, ConnectionOptions } from 'typeorm';

import { AppModule, getMailTransport } from './../app.module';
import { ConfigService } from 'src/config/config.service';

jest
  .mock('./../components/User/user.service', () => ({
    UserService: jest.fn(),
  }))
  .mock('./../components/AdminUser/adminUser.service', () => ({
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
