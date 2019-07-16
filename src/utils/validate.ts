import { validate as classValidate } from 'class-validator';
import { BadRequestException } from '@nestjs/common';
import { isArray } from 'util';

interface Data {
  [key: string]: any;
}

export const validate = async (
  data: Data,
  classTemplate: { new (): Data },
): Promise<void> => {
  const instanceClass = new classTemplate();
  Object.keys(data).forEach((key): void => {
    instanceClass[key] = data[key];
  });

  const errors = await classValidate(instanceClass, {
    forbidUnknownValues: true,
    forbidNonWhitelisted: true,
    whitelist: true,
  });

  if (errors.length > 0) {
    if (isArray(errors)) {
      throw new BadRequestException(errors[0].constraints);
    }
    throw new BadRequestException('Validation failed');
  }
};
