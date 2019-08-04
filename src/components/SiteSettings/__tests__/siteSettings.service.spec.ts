/* eslint-disable @typescript-eslint/camelcase */

import { SiteSettings } from './../../../Repositories/siteSettings.entity';
import { SiteSettingsRepositoryMock, mockSiteSettings } from '../../../mocks/index';
import { SiteSettingsService } from './../../SiteSettings/siteSettings.service';
import { DeepPartial } from 'typeorm';

describe('SiteSettingsService', () => {
  let siteSettingsService: SiteSettingsService;

  beforeEach(() => {
    siteSettingsService = new SiteSettingsService(SiteSettingsRepositoryMock);
  });

  describe('createSiteSettings', () => {
    it('returns Promise<SiteSettingsDto>', async () => {
      jest
        .spyOn(SiteSettingsRepositoryMock, 'save')
        .mockImplementationOnce(
          () =>
            (mockSiteSettings as unknown) as Promise<
              DeepPartial<SiteSettings> & SiteSettings
            >,
        );
      expect(await siteSettingsService['createSiteSettings']()).toEqual(
        await mockSiteSettings,
      );
    });
  });

  describe('getSiteSettings', () => {
    it('returns Promise<SiteSettingsDto> 1', async () => {
      jest
        .spyOn(SiteSettingsRepositoryMock, 'find')
        .mockImplementationOnce(
          () => ([mockSiteSettings] as unknown) as Promise<SiteSettings[]>,
        );

      expect(await siteSettingsService.getSiteSettings()).toEqual(await mockSiteSettings);
    });

    it('returns Promise<SiteSettingsDto> 2', async () => {
      jest
        .spyOn(SiteSettingsRepositoryMock, 'find')
        .mockImplementationOnce(() => ([] as unknown) as Promise<SiteSettings[]>);
      jest
        .spyOn(SiteSettingsRepositoryMock, 'save')
        .mockImplementationOnce(
          () =>
            (mockSiteSettings as unknown) as Promise<
              DeepPartial<SiteSettings> & SiteSettings
            >,
        );

      expect(await siteSettingsService.getSiteSettings()).toEqual(await mockSiteSettings);
    });
  });
});
