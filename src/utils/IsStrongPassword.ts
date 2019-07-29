import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

const tests = [
  new RegExp(/[a-z]/),
  new RegExp(/[A-Z]/),
  new RegExp(/[0-9]/),
  new RegExp(/[^\w]/),
];

@ValidatorConstraint({ name: 'isStrongPassword', async: false })
export class IsStrongPassword implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    let result = true;
    for (let i = 0; i < tests.length; i++) {
      if (!tests[i].test(password)) {
        result = false;
        break;
      }
    }
    return result;
  }

  defaultMessage(): string {
    return 'Password strength is not good enough';
  }
}
