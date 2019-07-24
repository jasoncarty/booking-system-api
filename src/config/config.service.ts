import { parse } from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ObjectSchema, string, number, object, validate, StringSchema } from '@hapi/joi';

interface EnvConfig {
  [key: string]: string;
}

const CONFIG_KEYS = [
  'BASE_URL',
  'DATABASE_HOST',
  'DATABASE_PASSWORD',
  'DATABASE_PORT',
  'DATABASE_USER',
  'DATABASE',
  'JWT_SECRET',
  'MAIL_EMAIL',
  'MAIL_PASSWORD',
  'NODE_ENV',
  'PORT',
];

export class ConfigService {
  public envConfig: EnvConfig;

  constructor() {
    let environment = process.env.NODE_ENV;
    if (!environment) {
      environment = 'development';
    }
    let config = {};
    if (environment !== 'production') {
      const filePath = `./../../.env-${environment}`;
      config = parse(readFileSync(resolve(__dirname, filePath)));
    } else {
      CONFIG_KEYS.forEach((key): string => (config[key] = process.env[key]));
    }
    this.envConfig = this.validateInput(config, environment);
  }

  validateDbPassword(environment: string): StringSchema {
    switch (environment) {
      case 'production':
        return string();
      case 'development':
        return string().valid('');
      case 'test':
        return string().valid('');
      default:
        return string();
    }
  }

  private getSchema(environment: string): ObjectSchema {
    return object().keys({
      BASE_URL: string().required(),
      DATABASE: string().required(),
      DATABASE_USER: string().required(),
      DATABASE_PASSWORD: this.validateDbPassword(environment),
      DATABASE_HOST: string().required(),
      DATABASE_PORT: number().required(),
      JWT_SECRET: string().required(),
      MAIL_EMAIL: string().required(),
      MAIL_PASSWORD: string().required(),
      NODE_ENV: string()
        .valid(['development', 'test', 'test-ci', 'production'])
        .default('development'),
      PORT: number().default(3000),
    });
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig, environment: string): EnvConfig {
    const { error, value: validatedEnvConfig } = validate(
      envConfig,
      this.getSchema(environment),
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
}
