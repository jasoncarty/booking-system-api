import { ConfigService } from './../config.service';

describe('ConfigService', () => {
  describe('constructor', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...OLD_ENV };
      delete process.env.NODE_ENV;
    });

    afterEach(() => {
      process.env = OLD_ENV;
    });

    it('sets this.envConfigs value', () => {
      const configService = new ConfigService();
      expect(configService.envConfig).toBeDefined();
    });

    it('uses process.env for setting the config', () => {
      process.env.NODE_ENV = 'production';
      process.env.DATABASE = 'dumped_db';
      process.env.DATABASE_USER = 'jason.carty';
      process.env.DATABASE_PASSWORD = 'iufoasiudfo';
      process.env.DATABASE_HOST = 'localhost';
      process.env.DATABASE_PORT = '5432';
      process.env.JWT_SECRET = '9a8sydf';
      process.env.MAIL_EMAIL = 'test@gmail.com';
      process.env.MAIL_PASSWORD = 'qwerty123';
      process.env.BASE_URL = 'http://localhost:3000';
      process.env.PORT = '3000';
      const configService = new ConfigService();
      expect(configService.envConfig).toBeDefined();
    });

    it('throws an error', () => {
      process.env.NODE_ENV = 'production';
      process.env.DATABASE = 'dumped_db';
      process.env.DATABASE_USER = 'jason.carty';
      process.env.DATABASE_PASSWORD = '';
      process.env.DATABASE_HOST = 'localhost';
      process.env.DATABASE_PORT = '5432';
      process.env.JWT_SECRET = '9a8sydf';
      process.env.MAIL_EMAIL = 'test@gmail.com';
      process.env.MAIL_PASSWORD = 'qwerty123';
      process.env.BASE_URL = 'http://localhost:3000';
      process.env.PORT = '3000';
      expect(() => new ConfigService()).toThrow();
    });
  });
});
