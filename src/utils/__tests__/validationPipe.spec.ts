import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import * as classValidator from 'class-validator';
import * as assert from 'assert';

import { ValidationPipe } from './../validationPipe';
import { ValidationError } from 'class-validator';
import { ExceptionDictionary } from './../../proto/exceptionDictionary.dto';

let validationPipe: ValidationPipe;
describe('validationPipe', () => {
  beforeEach(() => {
    validationPipe = new ValidationPipe();
  });

  describe('transform', () => {
    it('returns a value if metatype is undeinfed', async () => {
      const value = [];
      const argMetaData = ({
        metatype: undefined,
      } as unknown) as ArgumentMetadata;

      expect(await validationPipe.transform(value, argMetaData)).toEqual(value);
    });

    it('returns a value if metatype does not need to be validated', async () => {
      const value = [];
      const argMetaData = ({
        metatype: String,
      } as unknown) as ArgumentMetadata;

      expect(await validationPipe.transform(value, argMetaData)).toEqual(value);
    });

    it('throws a BadRequestException 1', async () => {
      const value = [];
      const errors = [new ValidationError(), new ValidationError()];
      const argMetaData = ({
        metatype: Function,
      } as unknown) as ArgumentMetadata;

      let expectedError: BadRequestException;

      jest
        .spyOn(classValidator, 'validate')
        .mockImplementation(() => Promise.resolve(errors));
      try {
        await validationPipe.transform(value, argMetaData);
      } catch (e) {
        expectedError = e;
      }

      assert.rejects(validationPipe.transform(value, argMetaData), expectedError);
    });

    it('throws a BadRequestException 2', async () => {
      const value = [];
      const errors = ('new ValidationError()' as unknown) as ValidationError[];
      const argMetaData = ({
        metatype: Function,
      } as unknown) as ArgumentMetadata;

      let expectedError: BadRequestException;

      jest
        .spyOn(classValidator, 'validate')
        .mockImplementation(() => Promise.resolve(errors));
      try {
        await validationPipe.transform(value, argMetaData);
      } catch (e) {
        expectedError = e;
      }

      assert.rejects(validationPipe.transform(value, argMetaData), expectedError);
    });

    it('returns value if errors is empty array', async () => {
      const value = [];
      const argMetaData = ({
        metatype: Function,
      } as unknown) as ArgumentMetadata;

      jest
        .spyOn(classValidator, 'validate')
        .mockImplementation(() => Promise.resolve([]));

      expect(await validationPipe.transform(value, argMetaData)).toEqual(value);
    });

    describe('mapException', () => {
      it('throws VALIDATION_ERROR_INVALID_EMAIL', () => {
        expect(() =>
          validationPipe['mapException']({ isEmail: 'Invalid email address' }),
        ).toThrow(ExceptionDictionary.VALIDATION_ERROR_INVALID_EMAIL);
      });

      it('throws VALIDATION_ERROR 1', () => {
        expect(() =>
          validationPipe['mapException']({ someKey: 'Invalid email address' }),
        ).toThrow(ExceptionDictionary.VALIDATION_ERROR);
      });
    });
  });
});
