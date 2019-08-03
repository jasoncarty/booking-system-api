/* eslint-disable @typescript-eslint/camelcase */

import { SiteSettings } from './../../../Repositories/siteSettings.entity';
import { SiteSettingsRepositoryMock, mockSiteSettings } from './../../../mocks/index';
import { AdminSiteSettingsService } from './../../AdminSiteSettings/adminSiteSettings.service';
import { DeepPartial } from 'typeorm';

describe('AdminSiteSettingsService', () => {
  let adminSiteSettingsService: AdminSiteSettingsService;

  beforeEach(() => {
    adminSiteSettingsService = new AdminSiteSettingsService(SiteSettingsRepositoryMock);
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
      expect(await adminSiteSettingsService['createSiteSettings']()).toEqual(
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

      expect(await adminSiteSettingsService.getSiteSettings()).toEqual(
        await mockSiteSettings,
      );
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

      expect(await adminSiteSettingsService.getSiteSettings()).toEqual(
        await mockSiteSettings,
      );
    });
  });

  describe('updateSiteSettings', () => {
    it('returns Promise<SiteSettingsDto>', async () => {
      jest
        .spyOn(SiteSettingsRepositoryMock, 'find')
        .mockImplementationOnce(
          () => ([mockSiteSettings] as unknown) as Promise<SiteSettings[]>,
        );
      jest
        .spyOn(SiteSettingsRepositoryMock, 'findOne')
        .mockImplementationOnce(
          () => (mockSiteSettings as unknown) as Promise<SiteSettings>,
        );

      expect(
        await adminSiteSettingsService.updateSiteSettings({
          site_name: 'another stupid name',
        }),
      ).toEqual(await mockSiteSettings);
    });
  });
});
