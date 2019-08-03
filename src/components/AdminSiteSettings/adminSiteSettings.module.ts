import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SiteSettings } from '../../Repositories/siteSettings.entity';
import { AdminSiteSettingsController } from './adminSiteSettings.controller';
import { AdminSiteSettingsService } from './adminSiteSettings.service';

@Module({
  imports: [TypeOrmModule.forFeature([SiteSettings])],
  providers: [AdminSiteSettingsService],
  controllers: [AdminSiteSettingsController],
})
export class AdminSiteSettingsModule {}
