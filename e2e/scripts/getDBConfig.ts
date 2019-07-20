import { ClientConfig } from 'pg';
import { parse } from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export const getDBConfig = (): ClientConfig => {
  const filePath = './../../.env-test';
  const config = parse(readFileSync(resolve(__dirname, filePath)));
  const {
    DATABASE,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_HOST,
    DATABASE_PORT,
  } = config;

  return {
    user: DATABASE_USER,
    host: DATABASE_HOST,
    database: DATABASE,
    password: DATABASE_PASSWORD,
    port: Number(DATABASE_PORT),
  };
};
