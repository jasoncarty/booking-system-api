import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { UserModule } from './../User/user.module';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UserModule],
  exports: [AuthService],
})
export class AuthModule {}
