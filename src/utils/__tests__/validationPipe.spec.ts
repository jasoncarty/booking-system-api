import * as classValidator from 'class-validator';
import { ArgumentMetadata } from '@nestjs/common';

import { ErrorCode } from '../../dto';
import { ValidationError } from 'class-validator';
import { ValidationPipe } from './../validationPipe';

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

      jest
        .spyOn(classValidator, 'validate')
        .mockImplementation(() => Promise.resolve(errors));
      try {
        await validationPipe.transform(value, argMetaData);
        throw new Error('Test failed');
      } catch (e) {
        expect(e.errorCode).toEqual(ErrorCode.VALIDATION_ERROR);
      }
    });

    it('throws a BadRequestException 2', async () => {
      const value = [];
      const errors = ('new ValidationError()' as unknown) as ValidationError[];
      const argMetaData = ({
        metatype: Function,
      } as unknown) as ArgumentMetadata;

      jest
        .spyOn(classValidator, 'validate')
        .mockImplementation(() => Promise.resolve(errors));
      try {
        await validationPipe.transform(value, argMetaData);
        throw new Error('Test failed');
      } catch (e) {
        expect(e.errorCode).toEqual(ErrorCode.VALIDATION_ERROR);
      }
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
        try {
          validationPipe['mapException'](({
            constraints: { isEmail: 'Invalid email address' },
          } as unknown) as ValidationError);
          throw new Error('Test failed');
        } catch (e) {
          expect(e.errorCode).toEqual(ErrorCode.VALIDATION_ERROR_INVALID_EMAIL);
        }
      });

      it('throws VALIDATION_ERROR 1', () => {
        try {
          validationPipe['mapException'](({
            constraints: { someKey: 'Invalid email address' },
          } as unknown) as ValidationError);
          throw new Error('Test failed');
        } catch (e) {
          expect(e.errorCode).toEqual(ErrorCode.VALIDATION_ERROR);
        }
      });
    });
  });
});
