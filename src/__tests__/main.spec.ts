import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';

jest.mock('@nestjs/core');

describe('Main', () => {
  describe('bootstrap', () => {
    it('creates a NestFactory', async () => {
      const listenSpy = jest.fn();
      const createSpy = Promise.resolve({
        listen: listenSpy
      }) as unknown as Promise<INestApplication>;

      jest.spyOn(NestFactory, 'create')
        .mockImplementation(() => createSpy);

      const bootstrap = require('./../main').default;
      await bootstrap();
      expect(listenSpy).toHaveBeenCalledTimes(2);
      expect(listenSpy).toHaveBeenCalledWith(3000);
    });
  });
});
