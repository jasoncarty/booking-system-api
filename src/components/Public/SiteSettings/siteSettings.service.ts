/* eslint @typescript-eslint/camelcase: 0 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SiteSettings } from '../../../Repositories/siteSettings.entity';
import { SiteSettingsDto } from '../../Admin/AdminSiteSettings/dto/site.settings.dto';

@Injectable()
export class SiteSettingsService {
  constructor(
    @InjectRepository(SiteSettings)
    private readonly siteSettingsRepository: Repository<SiteSettings>,
  ) {}

  private async createSiteSettings(): Promise<SiteSettingsDto> {
    return await this.siteSettingsRepository.save({
      site_name: 'The Booking System',
      maximum_event_attendees: 12,
    });
  }

  async getSiteSettings(): Promise<SiteSettingsDto> {
    let settings: SiteSettingsDto;
    settings = (await this.siteSettingsRepository.find())[0];
    if (!settings) {
      return await this.createSiteSettings();
    }
    return settings;
  }
}
