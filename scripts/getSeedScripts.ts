import { genSalt, hash } from 'bcryptjs';

import { SeedScriptObject } from './seedScriptObject.dto';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await genSalt(10);
  return await hash(password, salt);
};

export const getSeedScripts = async (): Promise<SeedScriptObject[]> => {
  const today = new Date();
  const tomorrow = new Date();
  const dayAfterTomorrow = new Date();
  const yesterday = new Date();
  tomorrow.setDate(today.getDate() + 1);
  dayAfterTomorrow.setDate(tomorrow.getDate() + 1);
  yesterday.setDate(yesterday.getDate() - 1);

  return [
    {
      preScript: "SELECT email FROM users WHERE email='some1@email.com'",
      preScriptResult: undefined,
      script: `INSERT INTO users (name, email, password, confirmed, confirmed_at, role) VALUES ('Jason Carty', 'some1@email.com', '${await hashPassword(
        'Qwerty123!',
      )}', true, '2015-01-01', 'admin')`,
    },
    {
      preScript: "SELECT email FROM users WHERE email='some2@email.com'",
      preScriptResult: undefined,
      script: `INSERT INTO users (name, email, password, confirmed, confirmed_at, role) VALUES ('Jason Carty', 'some2@email.com', '${await hashPassword(
        'Qwerty123!',
      )}', true, '2015-01-01', 'user')`,
    },
    {
      preScript: "SELECT email FROM users WHERE email='some3@email.com'",
      preScriptResult: undefined,
      script: `INSERT INTO users (name, email, password, confirmed, confirmed_at, role) VALUES ('Jason Carty', 'some3@email.com', '${await hashPassword(
        'Qwerty123!',
      )}', false, '2015-01-01', 'user')`,
    },
    {
      preScript: "SELECT id FROM events WHERE id='1'",
      preScriptResult: undefined,
      script: `INSERT INTO events (name, description, starts_at, ends_at, title, maximum_event_attendees) VALUES ('The first event', 'the description of the first event', '${tomorrow.toISOString()}', '${dayAfterTomorrow.toISOString()}', 'The first events title', 8)`,
    },
    {
      preScript: "SELECT id FROM events WHERE id='2'",
      preScriptResult: undefined,
      script: `INSERT INTO events (name, description, starts_at, ends_at, title, maximum_event_attendees) VALUES ('The second event', 'the description of the second event', '${tomorrow.toISOString()}', '${dayAfterTomorrow.toISOString()}', 'The second events title', 10)`,
    },
    {
      preScript: "SELECT id FROM events WHERE id='3'",
      preScriptResult: undefined,
      script: `INSERT INTO events (name, description, starts_at, ends_at, title, maximum_event_attendees) VALUES ('The third event', 'the description of the third event', '${tomorrow.toISOString()}', '${dayAfterTomorrow.toISOString()}', 'The third events title', 5)`,
    },
    {
      preScript: "SELECT id FROM events WHERE id='4'",
      preScriptResult: undefined,
      script: `INSERT INTO events (name, description, starts_at, ends_at, title, maximum_event_attendees) VALUES ('The fourth event', 'the description of the fourth event', '${yesterday.toISOString()}', '${yesterday.toISOString()}', 'The third events title', 5)`,
    },
  ];
};
