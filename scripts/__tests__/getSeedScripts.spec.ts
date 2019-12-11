import * as bcryptjsModule from 'bcryptjs';

import { hashPassword } from './../getSeedScripts';

describe('getSeedScripts', () => {
  describe('hashPassword', () => {
    it('returns a Promise<string>', async () => {
      const hashSpy = jest.fn();
      jest.spyOn(bcryptjsModule, 'genSalt').mockImplementationOnce(() => 'salt');
      jest.spyOn(bcryptjsModule, 'hash').mockImplementationOnce(hashSpy);
      await hashPassword('password');
      expect(hashSpy).toHaveBeenCalledTimes(1);
      expect(hashSpy).toHaveBeenCalledWith('password', 'salt');
    });
  });
});
