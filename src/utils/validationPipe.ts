import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { isArray } from 'util';
import { ExceptionDictionary } from './../proto';

interface ValidationExceptionMapObject {
  isEmail: object;
  isStrongPassword: object;
}

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    });
    if (errors.length > 0) {
      if (isArray(errors)) {
        this.mapException(errors[0]);
      }
      throw new ExceptionDictionary().VALIDATION_ERROR;
    }
    return value;
  }

  private validationExceptionMap = (stack?: string): ValidationExceptionMapObject => ({
    isEmail: new ExceptionDictionary(stack).VALIDATION_ERROR_INVALID_EMAIL,
    isStrongPassword: new ExceptionDictionary(stack).VALIDATION_ERROR_PASSWORD_STRENGTH,
  });

  private mapException(e: ValidationError): void {
    if (e && e.constraints) {
      const errorKey = Object.keys(e.constraints)[0];
      const error =
        this.validationExceptionMap(JSON.stringify(e.constraints))[errorKey] ||
        new ExceptionDictionary(JSON.stringify(e.constraints)).VALIDATION_ERROR;
      throw error;
    }
    throw new ExceptionDictionary().VALIDATION_ERROR;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
