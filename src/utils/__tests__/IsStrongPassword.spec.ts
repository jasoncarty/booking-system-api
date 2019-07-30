import { ValidatorConstraintInterface } from 'class-validator';
import { IsStrongPassword } from './../IsStrongPassword';

describe('IsStrongPassword', () => {
  let isStrongPassword: ValidatorConstraintInterface;

  beforeEach(() => {
    isStrongPassword = new IsStrongPassword();
  });

  describe('validate', () => {
    it('tests each regular expression', () => {
      expect(isStrongPassword.validate('qwerty')).toBeFalsy();
      expect(isStrongPassword.validate('qwerty123')).toBeFalsy();
      expect(isStrongPassword.validate('Qwerty123')).toBeFalsy();
      expect(isStrongPassword.validate('Qwerty123!')).toBeTruthy();
    });
  });

  describe('defaultMessage', () => {
    it('returns a string', () => {
      expect(isStrongPassword.defaultMessage()).toBe(
        'Password strength is not good enough',
      );
    });
  });
});
