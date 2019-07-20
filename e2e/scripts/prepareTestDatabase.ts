import { Client } from 'pg';
import { createConnection, Connection } from 'typeorm';
import 'reflect-metadata';

import { Colours } from './colours.enum';
import { getDBConfig } from './getDBConfig';
import { echoMessage } from './echoMessage';
import { connectToDBasPG } from './connectToDBasPG';
import { getSeedScripts } from './getSeedScripts';

const getClient = (): Client => new Client(getDBConfig());

const createNewDatabase = async (): Promise<void> => {
  const { host, password, port, user, database } = getDBConfig();
  const client = connectToDBasPG({ host, password, port });
  await client.connect();
  await client.query(`CREATE DATABASE "${database}" WITH OWNER "${user}"`);
  await client.end();
};

const getConnection = async (client: Client, database: string): Promise<Client> => {
  try {
    await client.connect();
    echoMessage(Colours.green, 'Test database exists');
    return client;
  } catch (e) {
    if (e.message === `database "${database}" does not exist`) {
      echoMessage(Colours.yellow, 'Test database does not exist, creating a new one.');
      await createNewDatabase();
      const newClient = getClient();
      await newClient.connect();
      echoMessage(Colours.green, 'Test database creation complete');
      return newClient;
    }
  }
};

const seedDatabase = async (client: Client): Promise<void> => {
  const scripts = await getSeedScripts();
  for (let i = 0; i < scripts.length; i++) {
    const res = await client.query(scripts[i].preScript);
    if (res.rows[0] === scripts[i].preScriptResult) {
      await client.query(scripts[i].script);
    }
  }
};

const synchronizeDatabase = async (): Promise<Connection> => {
  const { host, password, port, user, database } = getDBConfig();
  return await createConnection({
    type: 'postgres' as 'postgres',
    host,
    port,
    username: user,
    password,
    database,
    logging: true,
    entities: [__dirname + './../../src/Repositories/*.entity{.ts,.js}'],
    synchronize: true,
  });
};

const prepareTestDatabase = async (): Promise<void> => {
  echoMessage(Colours.blue, 'Preparing test database...');
  const disconnectedClient = getClient();
  const { database } = getDBConfig();
  const connectedClient = await getConnection(disconnectedClient, database);
  await synchronizeDatabase();
  echoMessage(Colours.green, 'Synchronised test database with typeOrm');
  await seedDatabase(connectedClient);
  echoMessage(Colours.green, 'Seeded Database succesfully');
  await connectedClient.end();
  echoMessage(Colours.blue, 'Test database has been prepared');
};

prepareTestDatabase();
