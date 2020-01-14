import { AppMailerModule } from '../../AppMailer/appMailer.module';
import { Module } from '@nestjs/common';
import { SiteSettingsModule } from '../SiteSettings/siteSettings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../Repositories/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AppMailerModule, SiteSettingsModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
