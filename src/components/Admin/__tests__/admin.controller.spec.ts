import { CreateUserDto, UpdateUserDto } from './../../../proto';
import { AdminController } from './../admin.controller';
import { AdminService } from './../admin.service';
import { appMailer, repositoryMock, allUsers, singleUser } from './../../../mocks';

describe('AdminController', () => {
  let adminService: AdminService;
  let adminController: AdminController;

  beforeEach(() => {
    adminService = new AdminService(repositoryMock, appMailer);
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
        } as CreateUserDto),
      ).toEqual(await singleUser);
    });
  });

  describe(':PUT /user/update/:id', () => {
    it('returns all users', async () => {
      jest.spyOn(adminService, 'updateUser').mockImplementation(() => singleUser);

      expect(
        await adminController.updateUser(
          {
            email: 'some@email.com',
            name: 'some name',
          } as UpdateUserDto,
          { id: 1 },
        ),
      ).toEqual(await singleUser);
    });
  });

  describe(':DELETE /users/delete/:id', () => {
    it('returns the deleted user', async () => {
      jest.spyOn(adminService, 'deleteUser').mockImplementationOnce(() => singleUser);

      expect(await adminController.deleteUser(1)).toEqual(await singleUser);
    });
  });
});
