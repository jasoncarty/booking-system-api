import { makeRequest, createUserToken, createAdminToken } from '../utils';
import { ErrorCode, EventWithAttendeesDto } from '../../src/proto';

describe('Events', () => {
  let userToken: string;
  let adminToken: string;
  let bookedEvent: EventWithAttendeesDto;

  beforeAll(async () => {
    userToken = await createUserToken();
    adminToken = await createAdminToken();
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
      expect(result.data.attendees).toBeDefined();
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
      expect(result.data.attendees).toBeDefined();
      expect(Array.isArray(result.data.attendees.reserves)).toBeTruthy();
      expect(Array.isArray(result.data.attendees.nonReserves)).toBeTruthy();
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
      expect(result.data.attendees).toBeDefined();
      expect(Array.isArray(result.data.attendees.reserves)).toBeTruthy();
      expect(Array.isArray(result.data.attendees.nonReserves)).toBeTruthy();
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
      expect(result.data.attendees.nonReserves).toHaveLength(
        bookedEvent.attendees.nonReserves.length - 1,
      );
    });
  });
});
