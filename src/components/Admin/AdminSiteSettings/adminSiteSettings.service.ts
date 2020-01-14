/* eslint @typescript-eslint/camelcase: 0 */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SiteSettings } from '../../../Repositories/siteSettings.entity';
import { SiteSettingsDto, UpdateSiteSettingsDto } from '../../../dto';
import { SiteSettingsService } from '../../Public/SiteSettings/siteSettings.service';

@Injectable()
export class AdminSiteSettingsService {
  constructor(
    @InjectRepository(SiteSettings)
    private readonly siteSettingsRepository: Repository<SiteSettings>,
    private readonly siteSettingsService: SiteSettingsService,
  ) {}

  async updateSiteSettings(values: UpdateSiteSettingsDto): Promise<SiteSettingsDto> {
    const settings = await this.siteSettingsService.getSiteSettings();

    const siteSettingsEntity = new SiteSettings();
    Object.assign(siteSettingsEntity, values);
    await this.siteSettingsRepository.update(settings.id, values);
    return this.siteSettingsRepository.findOne(settings.id);
  }
}
