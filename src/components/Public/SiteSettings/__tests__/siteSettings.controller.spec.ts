import { SiteSettingsRepositoryMock, mockSiteSettings } from '../../../../mocks/index';
import { SiteSettingsService } from '../siteSettings.service';
import { SiteSettingsController } from '../siteSettings.controller';

describe('SiteSettingsController', () => {
  let siteSettingsService: SiteSettingsService;
  let siteSettingsController: SiteSettingsController;

  beforeEach(() => {
    siteSettingsService = new SiteSettingsService(SiteSettingsRepositoryMock);
    siteSettingsController = new SiteSettingsController(siteSettingsService);
  });

  describe('/GET /site-settings', () => {
    it('returns Promise<SiteSettingsDto>', async () => {
      jest
        .spyOn(siteSettingsService, 'getSiteSettings')
        .mockImplementationOnce(() => mockSiteSettings);

      expect(await siteSettingsController.getSiteSettings()).toEqual(
        await mockSiteSettings,
      );
    });
  });
});
