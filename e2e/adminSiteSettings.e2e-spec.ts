/* eslint-disable @typescript-eslint/camelcase */
import { ErrorCode } from './../src/proto';
import { makeRequest, createAdminToken, createUserToken } from './utils';

describe('AdminSiteSettings', () => {
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    adminToken = await createAdminToken();
    userToken = await createUserToken();
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
  });

  describe('/GET /admin/site-settings', () => {
    it('updates the siteSettings', async () => {
      const res = await makeRequest({
        method: 'PUT',
        url: '/admin/site-settings',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        data: {
          site_name: 'Test site',
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.data.site_name).toEqual('Test site');
    });

    it('returns ExceptionDictionary.AUTHENTICATION_FAILED error code', async () => {
      const res = await makeRequest({
        method: 'PUT',
        url: '/admin/site-settings',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.AUTHENTICATION_FAILED);
    });
  });
});
