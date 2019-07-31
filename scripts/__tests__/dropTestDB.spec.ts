import { Client } from 'pg';
import { dropTestDB } from './../dropTestDB';
import * as connectToDBasPGModule from './../connectToDBasPG';
import * as getDBConfigModule from './../getDBConfig';

jest.mock('./../echoMessage', () => ({
  echoMessage: jest.fn(),
}));
jest.mock('pg');

describe('dropTestDB', () => {
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
});
