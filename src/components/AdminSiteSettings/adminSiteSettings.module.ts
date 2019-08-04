import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SiteSettings } from '../../Repositories/siteSettings.entity';
import { AdminSiteSettingsController } from './adminSiteSettings.controller';
import { AdminSiteSettingsService } from './adminSiteSettings.service';
import { SiteSettingsModule } from './../SiteSettings/siteSettings.module';

@Module({
  imports: [TypeOrmModule.forFeature([SiteSettings]), SiteSettingsModule],
  providers: [AdminSiteSettingsService],
  controllers: [AdminSiteSettingsController],
})
export class AdminSiteSettingsModule {}
