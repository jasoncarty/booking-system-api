/* eslint-disable @typescript-eslint/camelcase */

import { SiteSettings } from '../../../../Repositories/siteSettings.entity';
import { SiteSettingsRepositoryMock, mockSiteSettings } from '../../../../mocks/index';
import { AdminSiteSettingsService } from '../adminSiteSettings.service';
import { SiteSettingsService } from '../../../Public/SiteSettings/siteSettings.service';

describe('AdminSiteSettingsService', () => {
  let adminSiteSettingsService: AdminSiteSettingsService;
  let siteSettingsService: SiteSettingsService;

  beforeEach(() => {
    siteSettingsService = new SiteSettingsService(SiteSettingsRepositoryMock);
    adminSiteSettingsService = new AdminSiteSettingsService(
      SiteSettingsRepositoryMock,
      siteSettingsService,
    );
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
