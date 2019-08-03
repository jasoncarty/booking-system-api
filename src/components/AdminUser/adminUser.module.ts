import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AdminService } from './adminUser.service';
import { AdminController } from './adminUser.controller';
import { AppMailerModule } from '../AppMailer/appMailer.module';
import { UserModule } from '../User/user.module';
import { User } from '../../Repositories/user.entity';

@Module({
  providers: [AdminService],
  imports: [TypeOrmModule.forFeature([User]), AppMailerModule, UserModule],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
