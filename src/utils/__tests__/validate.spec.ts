import { BadRequestException } from '@nestjs/common';
import * as assert from 'assert';
import * as classValidator from 'class-validator';
import { ValidationError } from 'class-validator';

import { validate } from './../validate';
import { UserConfirmationValidator } from './../../components/User/validators/user.confirmation.validator';

describe('validate', () => {
  it('Throws first error in array', async () => {
    const values = {
      email: '123iouwer',
      password: 'qwerty123',
    };
    let error: BadRequestException;
    try {
      await validate(values, UserConfirmationValidator);
    } catch (e) {
      error = e;
    }

    assert.rejects(validate(values, UserConfirmationValidator), error);
  });

  it('Throws error', async () => {
    const values = {
      email: '123iouwer',
      password: 'qwerty123',
    };
    const errors = ('new ValidationError()' as unknown) as ValidationError[];

    jest
      .spyOn(classValidator, 'validate')
      .mockImplementation(() => Promise.resolve(errors));

    let error: BadRequestException;

    try {
      await validate(values, UserConfirmationValidator);
    } catch (e) {
      error = e;
    }

    assert.rejects(validate(values, UserConfirmationValidator), error);
  });
});
