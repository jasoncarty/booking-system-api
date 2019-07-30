import { User } from './../src/Repositories/user.entity';
import { ErrorCode } from './../src/proto';
import { makeRequest, createUserToken, createAdminToken } from './utils';

describe('User', () => {
  let userToken: string;
  let adminToken: string;
  let userToConfirm: User;

  beforeAll(async () => {
    userToken = await createUserToken();
    adminToken = await createAdminToken();
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
  });

  describe('/GET /users/profile', () => {
    it('returns user.data', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/users/profile',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.token).toBeDefined();
    });

    it('returns ExceptionDictionary.NOT_AUTHORIZED error code', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/users/profile',
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      console.log(result);
      expect(result.errorCode).toEqual(ErrorCode.NOT_AUTHORIZED);
    });
  });

  describe('/PUT /users', () => {
    it('returns user.data', async () => {
      const res = await makeRequest({
        method: 'PUT',
        url: '/users',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        data: {
          name: 'Julio Iglesias',
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.token).toBeDefined();
    });

    it('returns ExceptionDictionary.AUTHENTICATION_FAILED error code', async () => {
      const res = await makeRequest({
        method: 'PUT',
        url: '/users',
        headers: {
          Authorization: `Bearer ousofiusdf`,
        },
        data: {
          name: 'Julio Iglesias',
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      console.log(result);
      expect(result.errorCode).toEqual(ErrorCode.AUTHENTICATION_FAILED);
    });
  });

  describe('/POST /users/confirmation/request', () => {
    it('sends a new User email to the user', async () => {
      const res = await makeRequest({
        method: 'POST',
        url: '/users/confirmation/request',
        data: {
          email: 'some1@email.com',
        },
      });

      expect(res.data).toBeDefined();
      expect(res.data.status).toBe(200);
    });
  });

  describe('/POST /users/confirmation/confirm/:verificationToken', () => {
    it('sets user.confirmed to true', async () => {
      const userResponse = await makeRequest({
        method: 'GET',
        url: '/admin/users/1',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      userToConfirm = userResponse.data.data;

      const res = await makeRequest({
        method: 'POST',
        url: `/users/confirmation/confirm/${userToConfirm.verification_token}`,
        data: {
          email: 'some1@email.com',
          password: 'Qwerty123!',
        },
      });

      expect(res.data).toBeDefined();
      expect(res.data.data.confirmed).toBeTruthy();
      expect(res.data.status).toBe(200);
    });
  });
});
