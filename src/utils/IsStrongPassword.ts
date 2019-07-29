import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

const tests = [
  new RegExp(/[a-z]/, 'g'),
  new RegExp(/[A-Z]/, 'g'),
  new RegExp(/[0-9]/, 'g'),
  new RegExp(/[^\w]/, 'g'),
];

@ValidatorConstraint({ name: 'isStrongPassword', async: false })
export class IsStrongPassword implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    return tests.every((test): boolean => test.test(password));
  }

  defaultMessage(): string {
    return 'Password strength is not good enough';
  }
}
