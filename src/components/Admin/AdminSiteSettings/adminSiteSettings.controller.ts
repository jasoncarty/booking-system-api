import { Controller, Put, Body } from '@nestjs/common';

import { AdminSiteSettingsService } from './adminSiteSettings.service';
import { SiteSettingsDto, UpdateSiteSettingsDto } from '../../../proto';

@Controller('admin/site-settings')
export class AdminSiteSettingsController {
  constructor(private service: AdminSiteSettingsService) {}

  @Put()
  updateSiteSettings(
    @Body() updateSiteSettingsDto: UpdateSiteSettingsDto,
  ): Promise<SiteSettingsDto> {
    return this.service.updateSiteSettings(updateSiteSettingsDto);
  }
}
