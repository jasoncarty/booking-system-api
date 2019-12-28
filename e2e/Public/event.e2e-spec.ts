import { makeRequest, createUserToken, createAdminToken } from '../utils';
import { ErrorCode, EventDto } from '../../src/proto';

describe('Events', () => {
  let userToken: string;
  let adminToken: string;
  let bookedEvent: EventDto;

  beforeAll(async () => {
    userToken = await createUserToken();
    adminToken = await createAdminToken();
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

  describe('/POST /events/book/:id', () => {
    it('adds an eventAttendee to the event', async () => {
      const res = await makeRequest({
        method: 'POST',
        url: '/events/book/1',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(Array.isArray(result.data.eventAttendees)).toBeTruthy();
      expect(result.data.eventAttendees).toHaveLength(1);
    });

    it('returns ExceptionDictionary.NOT_AUTHORIZED error code', async () => {
      const res = await makeRequest({
        method: 'POST',
        url: '/events/book/1',
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.NOT_AUTHORIZED);
    });

    it('returns ExceptionDictionary.DUPLICATE_EVENT_ATTENDEE_ERROR error code', async () => {
      const res = await makeRequest({
        method: 'POST',
        url: '/events/book/1',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.DUPLICATE_EVENT_ATTENDEE_ERROR);
    });

    it('adds an eventAttendee to the event 2', async () => {
      const res = await makeRequest({
        method: 'POST',
        url: '/events/book/1',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(Array.isArray(result.data.eventAttendees)).toBeTruthy();
      expect(result.data.eventAttendees).toHaveLength(2);
      expect(result.data.eventAttendees[0].user).toBeDefined();
      bookedEvent = result.data;
    });
  });

  describe('/POST /events/cance/:id', () => {
    it('cancels an event booking', async () => {
      const cancelEventResponse = await makeRequest({
        method: 'POST',
        url: '/events/cancel/1',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const { data: result } = cancelEventResponse;
      expect(result.data.eventAttendees).toHaveLength(
        bookedEvent.eventAttendees.length - 1,
      );
    });
  });
});
