import { ErrorCode } from './../src/proto';
import { makeRequest, createAdminToken, createUserToken } from './utils';

describe('Admin', () => {
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    adminToken = await createAdminToken();
    userToken = await createUserToken();
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
  });

  describe('/GET /admin/users', () => {
    it('returns an array of users', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/admin/users',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
      expect(result.token).toBeDefined();
    });

    it('returns ExceptionDictionary.AUTHENTICATION_FAILED error code', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/admin/users',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      console.log(result);
      expect(result.errorCode).toEqual(ErrorCode.AUTHENTICATION_FAILED);
    });
  });

  describe('/GET /admin/user/:id', () => {
    it('returns a user', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/admin/users/2',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.token).toBeDefined();
    });

    it('returns ExceptionDictionary.AUTHENTICATION_FAILED error code', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/admin/users/1',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      console.log(result);
      expect(result.errorCode).toEqual(ErrorCode.AUTHENTICATION_FAILED);
    });
  });

  describe('/POST /admin/users/create', () => {
    it('creates a user', async () => {
      const res = await makeRequest({
        method: 'POST',
        url: '/admin/users/create',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        data: {
          name: 'Roger Dodger',
          email: 'roger@dogder.com',
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.data.name).toEqual('Roger Dodger');
      expect(result.token).toBeDefined();
    });

    it('returns ExceptionDictionary.AUTHENTICATION_FAILED error code', async () => {
      const res = await makeRequest({
        method: 'POST',
        url: '/admin/users/create',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        data: {
          name: 'Roger Dodger',
          email: 'roger@dogder.com',
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      console.log(result);
      expect(result.errorCode).toEqual(ErrorCode.AUTHENTICATION_FAILED);
    });
  });

  describe('/PUT /admin/users/update/:id', () => {
    it('updates a user', async () => {
      const res = await makeRequest({
        method: 'PUT',
        url: '/admin/users/update/1',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        data: {
          name: 'Roger Dodger',
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.data.name).toEqual('Roger Dodger');
      expect(result.token).toBeDefined();
    });

    it('returns ExceptionDictionary.AUTHENTICATION_FAILED error code', async () => {
      const res = await makeRequest({
        method: 'PUT',
        url: '/admin/users/update/1',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        data: {
          name: 'Roger Dodger',
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      console.log(result);
      expect(result.errorCode).toEqual(ErrorCode.AUTHENTICATION_FAILED);
    });
  });

  describe('/DELETE /admin/users/delete/:id', () => {
    it('deletes a user', async () => {
      const res = await makeRequest({
        method: 'DELETE',
        url: '/admin/users/delete/3',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(result.data.name).toBeDefined();
      expect(result.token).toBeDefined();
    });

    it('returns ExceptionDictionary.AUTHENTICATION_FAILED error code', async () => {
      const res = await makeRequest({
        method: 'DELETE',
        url: '/admin/users/delete/3',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      console.log(result);
      expect(result.errorCode).toEqual(ErrorCode.AUTHENTICATION_FAILED);
    });

    it('returns ExceptionDictionary.USER_DELETION_ERROR_SELF_DELETION error code', async () => {
      const res = await makeRequest({
        method: 'DELETE',
        url: '/admin/users/delete/1',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      console.log(result);
      expect(result.errorCode).toEqual(ErrorCode.USER_DELETION_ERROR_SELF_DELETION);
    });
  });
});
