/* eslint-disable @typescript-eslint/camelcase */

import { SiteSettingsRepositoryMock, mockSiteSettings } from '../../../mocks/index';
import { AdminSiteSettingsController } from '../adminSiteSettings.controller';
import { AdminSiteSettingsService } from '../adminSiteSettings.service';
import { SiteSettingsService } from './../../SiteSettings/siteSettings.service';

describe('AdminSiteSettingsController', () => {
  let adminSiteSettingsService: AdminSiteSettingsService;
  let adminSiteSettingsController: AdminSiteSettingsController;
  let siteSettingsService: SiteSettingsService;

  beforeEach(() => {
    siteSettingsService = new SiteSettingsService(SiteSettingsRepositoryMock);
    adminSiteSettingsService = new AdminSiteSettingsService(
      SiteSettingsRepositoryMock,
      siteSettingsService,
    );
    adminSiteSettingsController = new AdminSiteSettingsController(
      adminSiteSettingsService,
    );
  });

  describe('/PUT admin/site-settings', () => {
    it('returns Promise<SiteSettingsDto>', async () => {
      jest
        .spyOn(adminSiteSettingsService, 'updateSiteSettings')
        .mockImplementationOnce(() => mockSiteSettings);
      expect(
        await adminSiteSettingsController.updateSiteSettings({
          site_name: 'The stupid site',
        }),
      ).toEqual(await mockSiteSettings);
    });
  });
});
