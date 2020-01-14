import { Controller, Get } from '@nestjs/common';

import { SiteSettingsDto } from '../../../dto';
import { SiteSettingsService } from './siteSettings.service';

@Controller('site-settings')
export class SiteSettingsController {
  constructor(private service: SiteSettingsService) {}

  @Get()
  getSiteSettings(): Promise<SiteSettingsDto> {
    return this.service.getSiteSettings();
  }
}
