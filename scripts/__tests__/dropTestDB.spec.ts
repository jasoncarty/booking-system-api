import { Client } from 'pg';
import { dropTestDB } from './../dropTestDB';
import * as connectToDBasPGModule from './../connectToDBasPG';
import * as getDBConfigModule from './../getDBConfig';

jest.mock('./../echoMessage', () => ({
  echoMessage: jest.fn(),
}));

describe('dropTestDB', () => {
  let processExitSpy: jest.Mock;
  let consoleErrorSpy: jest.Mock;

  beforeAll(() => {
    processExitSpy = (jest.spyOn(process, 'exit') as any).mockImplementation(() => {});
    consoleErrorSpy = (jest.spyOn(console, 'error') as any).mockImplementation(jest.fn());
  });

  afterAll(() => {
    processExitSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('calls connect, query and end on client', async () => {
    jest.spyOn(getDBConfigModule, 'getDBConfig').mockImplementation(() => ({
      host: 'host',
      password: 'password',
      port: 1234,
      database: 'database',
    }));

    const connect = jest.fn();
    const query = jest.fn();
    const end = jest.fn();
    jest.spyOn(connectToDBasPGModule, 'connectToDBasPG').mockImplementationOnce(
      () =>
        (({
          connect,
          query,
          end,
        } as unknown) as Client),
    );

    await dropTestDB();
    expect(connect).toHaveBeenCalledTimes(1);
    expect(query).toHaveBeenCalledWith('DROP DATABASE IF EXISTS "database"');
    expect(end).toHaveBeenCalledTimes(1);
  });

  it('invokes process.exit with 1 as argument', async () => {
    jest.spyOn(getDBConfigModule, 'getDBConfig').mockImplementation(() => ({
      host: 'host',
      password: 'password',
      port: 1234,
      database: 'database',
    }));

    jest.spyOn(connectToDBasPGModule, 'connectToDBasPG').mockImplementation(
      () =>
        (({
          connect: jest.fn(),
          query: () => {
            throw new Error('lkajsdf');
          },
          end: jest.fn(),
        } as unknown) as Client),
    );

    await dropTestDB();
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
