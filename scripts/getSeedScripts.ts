import { genSalt, hash } from 'bcryptjs';

import { SeedScriptObject } from './seedScriptObject.dto';

const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return await hash(password, salt);
};

export const getSeedScripts = async (): Promise<SeedScriptObject[]> => {
  return [
    {
      preScript: "SELECT * FROM users WHERE email='some1@email.com'",
      preScriptResult: undefined,
      script: `INSERT INTO users (name, email, password, confirmed, confirmed_at, role) VALUES ('Jason Carty', 'some1@email.com', '${await hashPassword(
        'qwerty123',
      )}', true, '2015-01-01', 'admin' )`,
    },
    {
      preScript: "SELECT * FROM users WHERE email='some2@email.com'",
      preScriptResult: undefined,
      script: `INSERT INTO users (name, email, password, confirmed, confirmed_at, role) VALUES ('Jason Carty', 'some2@email.com', '${await hashPassword(
        'qwerty123',
      )}', true, '2015-01-01', 'user' )`,
    },
    {
      preScript: "SELECT * FROM users WHERE email='some3@email.com'",
      preScriptResult: undefined,
      script: `INSERT INTO users (name, email, password, confirmed, confirmed_at, role) VALUES ('Jason Carty', 'some3@email.com', '${await hashPassword(
        'qwerty123',
      )}', false, '2015-01-01', 'user' )`,
    },
  ];
};
