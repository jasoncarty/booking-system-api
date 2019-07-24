import { Client } from 'pg';
import {
  prepareTestDatabase,
  synchronizeDatabase,
  seedDatabase,
  getConnection,
  createNewDatabase,
  getClient,
} from '../prepareTestDatabase';
import * as prepareTestDatabaseModule from '../prepareTestDatabase';
import * as connectToDBasPGModule from './../connectToDBasPG';
import * as mocks from './../../src/mocks';

jest.mock('./../echoMessage', () => ({
  echoMessage: jest.fn(),
}));
jest.mock('./../getDBConfig', () => ({
  getDBConfig: () => ({
    host: 'host',
    user: 'postgres',
    password: 'password',
    port: 1234,
    database: 'database',
  }),
}));
jest.mock('typeorm', () => ({
  createConnection: jest.fn(),
}));
jest.mock('pg', () => ({
  Client: class Client {
    connect() {
      return jest.fn();
    }
    end() {
      return jest.fn();
    }
    query() {
      return Promise.resolve({ rows: [undefined] });
    }
  },
}));

describe('prepareTestDatabase', () => {
  const connect = jest.fn();
  const query = jest.fn();
  const end = jest.fn();

  describe('getClient', () => {
    it('returns an instance of pg.Client', () => {
      const client = getClient();
      expect(client).toBeDefined();
      expect(client).toBeInstanceOf(Client);
    });
  });

  describe('createNewDatabase', () => {
    it('calls connect, query and end on client', async () => {
      jest.spyOn(connectToDBasPGModule, 'connectToDBasPG').mockImplementationOnce(
        () =>
          (({
            connect,
            query,
            end,
          } as unknown) as Client),
      );

      await createNewDatabase();
      expect(connect).toHaveBeenCalledTimes(1);
      expect(query).toHaveBeenCalledWith(
        'CREATE DATABASE "database" WITH OWNER "postgres"',
      );
      expect(end).toHaveBeenCalledTimes(1);
    });
  });

  describe('getConnection', () => {
    it('returns an instance of client', async () => {
      jest
        .spyOn(connectToDBasPGModule, 'connectToDBasPG')
        .mockImplementationOnce(() => mocks.mockClient);

      const client = await getConnection(mocks.mockClient, 'database');
      expect(client).toBeDefined();
      expect(client).toBe(mocks.mockClient);
    });

    it('creates the test database', async () => {
      const _mockClient = ({
        ...mocks.mockClient,
        connect: () => Promise.reject(new Error('database "database" does not exist')),
      } as unknown) as Client;

      jest
        .spyOn(prepareTestDatabaseModule, 'getClient')
        .mockImplementationOnce(() => mocks.mockClient);

      const client = await getConnection(_mockClient, 'database');
      expect(client).toBeDefined();
    });
  });

  describe('seedDatabase', () => {
    it('executes scripts in a loop', async () => {
      const querySpy = jest.fn(() => Promise.resolve({ rows: [undefined] }));
      const _mockClient = ({
        ...mocks.mockClient,
        query: querySpy,
      } as unknown) as Client;

      await seedDatabase(_mockClient);
      expect(querySpy).toHaveBeenCalled();
    });
  });
});
