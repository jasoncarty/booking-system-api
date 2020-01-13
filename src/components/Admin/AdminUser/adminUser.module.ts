import { AdminController } from './adminUser.controller';
import { AdminService } from './adminUser.service';
import { AppMailerModule } from '../../AppMailer/appMailer.module';
import { Module } from '@nestjs/common';
import { SiteSettingsModule } from '../../Public/SiteSettings/siteSettings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../Repositories/user.entity';
import { UserModule } from '../../Public/User/user.module';

@Module({
  providers: [AdminService],
  imports: [
    TypeOrmModule.forFeature([User]),
    AppMailerModule,
    UserModule,
    SiteSettingsModule,
  ],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
