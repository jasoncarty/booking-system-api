import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ErrorCode, ExceptionDictionary } from '../dto';
import { ValidationError, validate } from 'class-validator';

import { isArray } from 'util';
import { plainToClass } from 'class-transformer';

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
      throw ExceptionDictionary({
        errorCode: ErrorCode.VALIDATION_ERROR,
      });
    }
    return value;
  }

  private validationExceptionMap = (stack?: string): ValidationExceptionMapObject => ({
    isEmail: ExceptionDictionary({
      stack,
      errorCode: ErrorCode.VALIDATION_ERROR_INVALID_EMAIL,
    }),
    isStrongPassword: ExceptionDictionary({
      stack,
      errorCode: ErrorCode.VALIDATION_ERROR_PASSWORD_STRENGTH,
    }),
  });

  private mapException(e: ValidationError): void {
    if (e && e.constraints) {
      const errorKey = Object.keys(e.constraints)[0];
      const error =
        this.validationExceptionMap(JSON.stringify(e.constraints))[errorKey] ||
        ExceptionDictionary({
          stack: JSON.stringify(e.constraints),
          errorCode: ErrorCode.VALIDATION_ERROR,
        });
      throw error;
    }
    throw ExceptionDictionary({
      errorCode: ErrorCode.VALIDATION_ERROR,
    });
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
