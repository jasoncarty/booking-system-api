import * as dotenv from 'dotenv';
import { getDBConfig } from './../getDBConfig';

describe('getDBConfig', () => {
  const config = {
    DATABASE_USER: 'postgres',
    DATABASE_HOST: 'localhost',
    DATABASE: 'booking-system-test',
    DATABASE_PASSWORD: '',
    DATABASE_PORT: 5432,
  };

  const format = {
    user: 'postgres',
    host: 'localhost',
    database: 'booking-system-test',
    password: '',
    port: 5432,
  };

  jest
    .spyOn(dotenv, 'parse')
    .mockImplementation(() => (config as unknown) as dotenv.DotenvParseOutput);

  it('returns clientConfig', () => {
    const clientConfig = getDBConfig();
    expect(clientConfig).toEqual(format);
  });

  it('sets environment to test', () => {
    const OLD_ENV = process.env;
    delete process.env.NODE_ENV;
    const clientConfig = getDBConfig();
    expect(clientConfig).toEqual(format);
    process.env = OLD_ENV;
  });
});
