import { AuthController } from '../auth.controller';
import { UserService } from '../../Public/User/user.service';
import { SiteSettingsService } from '../../Public/SiteSettings/siteSettings.service';
import {
  appMailer,
  authenticatedUser,
  UserRepositoryMock,
  SiteSettingsRepositoryMock,
} from './../../../mocks';

describe('AuthController', () => {
  let userService: UserService;
  let siteSettingsService: SiteSettingsService;
  let authController: AuthController;

  beforeEach(() => {
    siteSettingsService = new SiteSettingsService(SiteSettingsRepositoryMock);
    userService = new UserService(UserRepositoryMock, appMailer, siteSettingsService);
    authController = new AuthController(userService);
  });

  describe(':POST /create', () => {
    it('creates a session', async () => {
      jest.spyOn(userService, 'loginUser').mockImplementation(() => authenticatedUser);

      expect(
        await authController.createSession({
          email: 'some@email.com',
          password: '7a9sd7f9as87df',
        }),
      ).toEqual(await authenticatedUser);
    });
  });
});
