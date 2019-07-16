import { verifyToken } from '../verifyToken';
import * as jwt from 'jsonwebtoken';

describe('verifiyToken', () => {
  it('returns a SessionDto', () => {
    const result = {
      email: 'some@email.com',
      iat: new Date('2019-01-01'),
      exp: new Date('2019-01-01'),
    };

    jest.spyOn(jwt, 'verify').mockImplementation(() => result);
    expect(verifyToken('y8a7sdyf')).toEqual(result);
  });
});
