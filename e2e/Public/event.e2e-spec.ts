import { makeRequest, createUserToken } from '../utils';
import { ErrorCode } from '../../src/proto';

describe('Events', () => {
  let userToken: string;

  beforeAll(async () => {
    userToken = await createUserToken();
    jest.spyOn(console, 'log').mockImplementation(jest.fn());
  });

  describe('/GET /events/:id', () => {
    it('returns an event', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/events/1',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.data.name).toBeDefined();
    });

    it('returns ExceptionDictionary.NOT_AUTHORIZED error code', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/events/1',
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.NOT_AUTHORIZED);
    });
  });

  describe('/GET /events', () => {
    it('returns an array of events', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/events',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(Array.isArray(result.data)).toBeTruthy();
      expect(result.status).toBe(200);
    });

    it('returns ExceptionDictionary.NOT_AUTHORIZED error code', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/events',
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.NOT_AUTHORIZED);
    });
  });
});
