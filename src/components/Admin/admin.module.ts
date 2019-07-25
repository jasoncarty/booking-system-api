import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AppMailerModule } from '../AppMailer/appMailer.module';
import { User } from '../../Repositories/user.entity';

@Module({
  providers: [AdminService],
  imports: [TypeOrmModule.forFeature([User]), AppMailerModule],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
