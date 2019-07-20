import { Colours } from './colours.enum';
import { connectToDBasPG } from './connectToDBasPG';
import { echoMessage } from './echoMessage';
import { getDBConfig } from './getDBConfig';

export const dropTestDB = async (): Promise<void> => {
  const { host, password, port, database } = getDBConfig();
  const client = connectToDBasPG({ host, password, port });
  await client.connect();
  await client.query(`DROP DATABASE IF EXISTS "${database}"`);
  await client.end();
  echoMessage(Colours.green, 'Dropped test database');
};

dropTestDB();
