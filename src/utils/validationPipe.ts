import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { isArray } from 'util';
import { ExceptionDictionary } from './../proto';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      if (isArray(errors)) {
        this.mapException(errors[0].constraints);
      }
      throw ExceptionDictionary.VALIDATION_ERROR;
    }
    return value;
  }

  private validationExceptionMap = {
    isEmail: ExceptionDictionary.VALIDATION_ERROR_INVALID_EMAIL,
    isStrongPassword: ExceptionDictionary.VALIDATION_ERROR_PASSWORD_STRENGTH,
  };

  private mapException(e: object): void {
    const errorKey = Object.keys(e)[0];
    const error =
      this.validationExceptionMap[errorKey] || ExceptionDictionary.VALIDATION_ERROR;
    throw error;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
