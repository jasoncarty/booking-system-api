import { Client, ClientConfig } from 'pg';

export const connectToDBasPG = (config: ClientConfig): Client => {
  const { host, password, port } = config;
  return new Client({
    user: 'postgres',
    host,
    database: 'postgres',
    password,
    port,
  });
};
