import { SessionDto } from '../proto';
import { ConfigService } from './../config/config.service';
import { verify } from 'jsonwebtoken';

export const verifyToken = (token: string): SessionDto => {
  const configService = new ConfigService();
  return verify(token, configService.envConfig.JWT_SECRET) as SessionDto;
};
