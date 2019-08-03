import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { isArray } from 'util';
import { ExceptionDictionary, ExceptionDictionaryObject } from './../proto';

interface ValidationExceptionMapObject {
  isEmail: ExceptionDictionaryObject;
  isStrongPassword: ExceptionDictionaryObject;
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

      throw ExceptionDictionary().VALIDATION_ERROR;
    }
    return value;
  }

  private validationExceptionMap = (stack?: string): ValidationExceptionMapObject => ({
    isEmail: ExceptionDictionary(stack).VALIDATION_ERROR_INVALID_EMAIL,
    isStrongPassword: ExceptionDictionary(stack).VALIDATION_ERROR_PASSWORD_STRENGTH,
  });

  private mapException(e: ValidationError): void {
    const errorKey = Object.keys(e.constraints)[0];
    const error =
      this.validationExceptionMap(JSON.stringify(e.constraints))[errorKey] ||
      ExceptionDictionary(JSON.stringify(e.constraints)).VALIDATION_ERROR;
    throw error;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
