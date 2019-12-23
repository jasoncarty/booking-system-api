import { Request } from 'express';

import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { appMailer, singleUser, UserRepositoryMock } from '../../../../mocks/index';

describe('UserController', () => {
  let userService: UserService;
  let userController: UserController;

  const request = ({
    headers: {
      authorization: 'Bearer lkajsdfölkjasdf',
    },
  } as unknown) as Request;

  beforeEach(async () => {
    userService = new UserService(UserRepositoryMock, appMailer);
    userController = new UserController(userService);
  });

  describe(':GET /users/profile', () => {
    it('Returns a user profile', async () => {
      jest.spyOn(userService, 'getProfile').mockImplementationOnce(() => singleUser);
      expect(await userController.getProfile(request)).toBe(await singleUser);
    });
  });

  describe(':PUT /users', () => {
    it('updates the user', async () => {
      jest.spyOn(userService, 'getProfile').mockImplementationOnce(() => singleUser);
      jest.spyOn(UserRepositoryMock, 'findOne').mockImplementationOnce(() => singleUser);
      expect(
        await userController.updateUser(
          {
            email: 'ljahsdf@ldhjkafs.com',
            name: 'lkjahsdf kljhasdf',
          },
          request,
        ),
      ).toBe(await singleUser);
    });
  });

  describe(':POST /users/confirmation/request', () => {
    it('requests confirmation', async () => {
      jest.spyOn(userService, 'getProfile').mockImplementationOnce(() => singleUser);
      jest.spyOn(UserRepositoryMock, 'findOne').mockImplementation(() => singleUser);
      expect(
        await userController.requestConfirmation({
          email: 'ljahsdf@ldhjkafs.com',
        }),
      ).toEqual({
        mailSent: true,
        details: {
          success: true,
        },
      });
    });
  });

  describe(':POST /users/confirmation/confirm/:verificationToken', () => {
    it('returns a confirmed user', async () => {
      jest.spyOn(userService, 'getProfile').mockImplementationOnce(() => singleUser);
      jest.spyOn(UserRepositoryMock, 'findOne').mockImplementationOnce(() => singleUser);
      expect(
        await userController.confirmAccount(
          {
            email: 'ljahsdf@ldhjkafs.com',
            password: 'Qwerty123!',
          },
          '8a7ds987asdf9',
        ),
      ).toBe(await singleUser);
    });
  });
});
