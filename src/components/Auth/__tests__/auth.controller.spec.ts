import { AuthController } from '../auth.controller';
import { UserService } from './../../User/user.service';
import { appMailer, authenticatedUser, repositoryMock } from './../../../mocks';

describe('AuthController', () => {
  let userService: UserService;
  let authController: AuthController;

  beforeEach(() => {
    userService = new UserService(repositoryMock, appMailer);
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
