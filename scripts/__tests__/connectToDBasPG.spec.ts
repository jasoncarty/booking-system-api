import { ClientConfig } from 'pg';
import { connectToDBasPG } from '../connectToDBasPG';

jest.mock('pg');

describe('connectToDBasPG', () => {
  it('returns a new pg Client', () => {
    const config = ({
      host: 'localhost',
      password: 'postgres',
      port: '5432',
    } as unknown) as ClientConfig;

    const client = connectToDBasPG(config);
    expect(client).toBeDefined();
  });
});
