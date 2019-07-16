import { AdminModule } from './../admin.module';
import { MiddlewareConsumer } from '@nestjs/common';

describe('AdminModule', () => {
  describe('configure', () => {
    it('configures the module with a middleware', () => {
      const consumer = ({
        apply: () => ({
          forRoutes: jest.fn(),
        }),
      } as unknown) as MiddlewareConsumer;

      const adminModule = new AdminModule();
    });
  });
});
