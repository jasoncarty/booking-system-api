import { Request } from 'express';

import { UserService } from '../../User/user.service';
import { AdminController } from '../adminUser.controller';
import { AdminService } from '../adminUser.service';
import { appMailer, UserRepositoryMock, allUsers, singleUser } from '../../../mocks';

describe('AdminController', () => {
  let adminService: AdminService;
  let adminController: AdminController;
  let userService: UserService;

  const request = ({
    headers: {
      authorization: 'Bearer lkajsdfölkjasdf',
    },
  } as unknown) as Request;

  beforeEach(() => {
    userService = new UserService(UserRepositoryMock, appMailer);
    adminService = new AdminService(UserRepositoryMock, appMailer, userService);
    adminController = new AdminController(adminService);
  });

  describe(':GET /users', () => {
    it('returns all users', async () => {
      jest.spyOn(adminService, 'getUsers').mockImplementation(() => allUsers);

      expect(await adminController.getUsers()).toEqual(await allUsers);
    });
  });

  describe('GET /user/:id', () => {
    it('returns all users', async () => {
      jest.spyOn(adminService, 'getUser').mockImplementation(() => singleUser);

      expect(await adminController.getUser({ id: 1 })).toEqual(await singleUser);
    });
  });

  describe(':POST /user/create', () => {
    it('returns all users', async () => {
      jest.spyOn(adminService, 'createUser').mockImplementation(() => singleUser);

      expect(
        await adminController.createUser({
          email: 'some@email.com',
          name: 'some name',
        }),
      ).toEqual(await singleUser);
    });
  });

  describe(':PUT /user/update/:id', () => {
    it('returns all users', async () => {
      jest.spyOn(adminService, 'updateUser').mockImplementation(() => singleUser);

      expect(
        await adminController.updateUser(
          { id: 1 },
          {
            email: 'some@email.com',
            name: 'some name',
          },
        ),
      ).toEqual(await singleUser);
    });
  });

  describe(':DELETE /users/delete/:id', () => {
    it('returns the deleted user', async () => {
      jest.spyOn(adminService, 'deleteUser').mockImplementationOnce(() => singleUser);

      expect(await adminController.deleteUser(1, request)).toEqual(await singleUser);
    });
  });
});
