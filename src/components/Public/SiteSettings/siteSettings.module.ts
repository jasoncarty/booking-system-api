import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SiteSettings } from '../../../Repositories/siteSettings.entity';
import { SiteSettingsService } from './siteSettings.service';
import { SiteSettingsController } from './siteSettings.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SiteSettings])],
  providers: [SiteSettingsService],
  controllers: [SiteSettingsController],
  exports: [SiteSettingsService],
})
export class SiteSettingsModule {}
