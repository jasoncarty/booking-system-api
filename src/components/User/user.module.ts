import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../../Repositories/user.entity';
import { AppMailerModule } from '../AppMailer/appMailer.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AppMailerModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
