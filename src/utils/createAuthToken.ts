import { sign } from 'jsonwebtoken';

import { ConfigService } from './../config/config.service';

export const createAuthToken = async (email: string): Promise<string> => {
  const configService = new ConfigService();
  const expiresIn = '3h';
  return await sign({ email }, configService.envConfig.JWT_SECRET, {
    expiresIn,
  });
};
