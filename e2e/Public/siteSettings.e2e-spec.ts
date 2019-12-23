/* eslint-disable @typescript-eslint/camelcase */
import { makeRequest, createUserToken } from '../utils';

describe('SiteSettings', () => {
  let userToken: string;

  beforeAll(async () => {
    userToken = await createUserToken();
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
  });

  describe('/GET /site-settings', () => {
    it('returns the siteSettings', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/site-settings',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.data.site_name).toBeDefined();
    });
  });
});
