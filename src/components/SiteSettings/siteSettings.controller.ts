import { Controller, Get } from '@nestjs/common';

import { SiteSettingsService } from './siteSettings.service';
import { SiteSettingsDto } from './../AdminSiteSettings/dto';

@Controller('site-settings')
export class SiteSettingsController {
  constructor(private service: SiteSettingsService) {}

  @Get()
  getSiteSettings(): Promise<SiteSettingsDto> {
    return this.service.getSiteSettings();
  }
}
