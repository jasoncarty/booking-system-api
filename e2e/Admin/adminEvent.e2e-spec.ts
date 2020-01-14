/* eslint-disable @typescript-eslint/camelcase */
import { ErrorCode, EventWithAttendeesDto } from '../../src/dto';
import { createAdminToken, createUserToken, makeRequest } from '../utils';

describe('AdminEvent', () => {
  let adminToken: string;
  let userToken: string;
  let currentEvents: EventWithAttendeesDto[];
  let createdEvent: EventWithAttendeesDto;

  beforeAll(async () => {
    adminToken = await createAdminToken();
    userToken = await createUserToken();
  });

  describe('/GET /admin/events', () => {
    it('returns an array of events', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/admin/events',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(Array.isArray(result.data)).toBeTruthy();
      expect(result.status).toBe(200);
      currentEvents = result.data;
    });

    it('returns ExceptionDictionary.AUTHENTICATION_FAILED error code', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/admin/events',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.AUTHENTICATION_FAILED);
    });

    it('returns ExceptionDictionary.NOT_AUTHORIZED error code', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/admin/events',
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.NOT_AUTHORIZED);
    });
  });

  describe('/GET /admin/events/old', () => {
    it('returns an array of events', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/admin/events/old',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(Array.isArray(result.data)).toBeTruthy();
      expect(result.status).toBe(200);
    });

    it('returns ExceptionDictionary.AUTHENTICATION_FAILED error code', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/admin/events/old',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.AUTHENTICATION_FAILED);
    });

    it('returns ExceptionDictionary.NOT_AUTHORIZED error code', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/admin/events/old',
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.NOT_AUTHORIZED);
    });
  });

  describe('/GET /admin/events/:id', () => {
    it('returns an event', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/admin/events/1',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.data.name).toBeDefined();
      expect(result.data.attendees).toBeDefined();
    });

    it('returns ExceptionDictionary.AUTHENTICATION_FAILED error code', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/admin/events/1',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.AUTHENTICATION_FAILED);
    });

    it('returns ExceptionDictionary.NOT_AUTHORIZED error code', async () => {
      const res = await makeRequest({
        method: 'GET',
        url: '/admin/events/1',
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.NOT_AUTHORIZED);
    });
  });

  describe(':POST /admin/events/create', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    it('creates an event', async () => {
      const res = await makeRequest({
        method: 'POST',
        url: '/admin/events/create',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        data: {
          name: 'Seventh event',
          description: 'Seventh description',
          starts_at: tomorrow.toISOString(),
          ends_at: tomorrow.toISOString(),
          maximum_event_attendees: 2,
          attendees: {
            reserves: [1],
            nonReserves: [2],
          },
        },
      });

      const { data: result } = res;
      createdEvent = result.data;
      const { reserves, nonReserves } = result.data.attendees;
      const { nonAttendees } = result.data;

      expect(result).toBeDefined();
      expect(Array.isArray(nonAttendees)).toBeTruthy();
      expect(Array.isArray(reserves)).toBeTruthy();
      expect(Array.isArray(nonReserves)).toBeTruthy();
      expect(reserves).toHaveLength(0);
      expect(nonReserves).toHaveLength(2);
      expect(nonAttendees).toHaveLength(1);

      const currentEventsRes = await makeRequest({
        method: 'GET',
        url: '/admin/events',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const { data: currentEventsResult } = currentEventsRes;
      expect(currentEventsResult.data).toHaveLength(currentEvents.length + 1);
    });

    it('returns ExceptionDictionary.AUTHENTICATION_FAILED error code', async () => {
      const res = await makeRequest({
        method: 'POST',
        url: '/admin/events/create',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        data: {
          name: 'Seventh event',
          description: 'Seventh description',
          starts_at: tomorrow.toISOString(),
          ends_at: tomorrow.toISOString(),
          maximum_event_attendees: 2,
          attendees: {
            reserves: [1],
            nonReserves: [2],
          },
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.AUTHENTICATION_FAILED);
    });

    it('returns ExceptionDictionary.NOT_AUTHORIZED error code', async () => {
      const res = await makeRequest({
        method: 'POST',
        url: '/admin/events/create',
        data: {
          name: 'Seventh event',
          description: 'Seventh description',
          starts_at: tomorrow.toISOString(),
          ends_at: tomorrow.toISOString(),
          maximum_event_attendees: 2,
          attendees: {
            reserves: [1],
            nonReserves: [2],
          },
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.NOT_AUTHORIZED);
    });

    it('returns ExceptionDictionary.VALIDATION_ERROR error code', async () => {
      const res = await makeRequest({
        method: 'POST',
        url: '/admin/events/create',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        data: {
          name: 'Seventh event',
          description: 'Seventh description',
          starts_at: tomorrow.toISOString(),
          ends_at: tomorrow.toISOString(),
          maximum_event_attendees: 2,
          disallowedParam: 'foo',
          attendees: {
            reserves: [1],
            nonReserves: [2],
          },
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.VALIDATION_ERROR);
    });

    it('returns ExceptionDictionary.VALIDATION_ERROR error code 1', async () => {
      const res = await makeRequest({
        method: 'POST',
        url: '/admin/events/create',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        data: {
          name: 'Seventh event',
          description: 'Seventh description',
          starts_at: tomorrow.toISOString(),
          ends_at: tomorrow.toISOString(),
          maximum_event_attendees: '2',
          attendees: {
            reserves: [1],
            nonReserves: [2],
          },
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.VALIDATION_ERROR);
    });

    it('returns ExceptionDictionary.VALIDATION_ERROR error code 2', async () => {
      const res = await makeRequest({
        method: 'POST',
        url: '/admin/events/create',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        data: {
          name: 'Seventh event',
          description: 'Seventh description',
          starts_at: tomorrow.toISOString(),
          ends_at: tomorrow.toISOString(),
          maximum_event_attendees: 2,
          attendees: {
            reserves: 1,
            nonReserves: [2],
          },
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.VALIDATION_ERROR);
    });

    it('returns ExceptionDictionary.VALIDATION_ERROR error code 3', async () => {
      const res = await makeRequest({
        method: 'POST',
        url: '/admin/events/create',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        data: {
          name: 'Seventh event',
          description: 'Seventh description',
          starts_at: tomorrow.toISOString(),
          ends_at: tomorrow.toISOString(),
          maximum_event_attendees: 2,
          attendees: {
            reserves: ['1'],
            nonReserves: [2],
          },
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.VALIDATION_ERROR);
    });

    it('returns ExceptionDictionary.VALIDATION_ERROR error code 4', async () => {
      const res = await makeRequest({
        method: 'POST',
        url: '/admin/events/create',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        data: {
          name: 'Seventh event',
          description: 'Seventh description',
          starts_at: tomorrow.toISOString(),
          ends_at: tomorrow.toISOString(),
          maximum_event_attendees: 2,
          attendees: {
            reserves: [1],
            nonReserves: [{ foo: 'bar' }],
          },
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.VALIDATION_ERROR);
    });
  });

  describe(':PUT /admin/events/:id', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    it('creates an event', async () => {
      const res = await makeRequest({
        method: 'PUT',
        url: `/admin/events/${createdEvent.id}`,
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        data: {
          name: 'Eighth event',
          description: 'Eighth description',
          starts_at: tomorrow.toISOString(),
          ends_at: tomorrow.toISOString(),
          maximum_event_attendees: 2,
          attendees: {
            reserves: [1],
            nonReserves: [2],
          },
        },
      });

      const { data: result } = res;
      const { reserves, nonReserves } = result.data.attendees;
      const { nonAttendees } = result.data;

      expect(result).toBeDefined();
      expect(Array.isArray(nonAttendees)).toBeTruthy();
      expect(Array.isArray(reserves)).toBeTruthy();
      expect(Array.isArray(nonReserves)).toBeTruthy();
      expect(reserves).toHaveLength(0);
      expect(nonReserves).toHaveLength(2);
      expect(nonAttendees).toHaveLength(1);
    });

    it('returns ExceptionDictionary.AUTHENTICATION_FAILED error code', async () => {
      const res = await makeRequest({
        method: 'PUT',
        url: `/admin/events/${createdEvent.id}`,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        data: {
          name: 'Eighth event',
          description: 'Eighth description',
          starts_at: tomorrow.toISOString(),
          ends_at: tomorrow.toISOString(),
          maximum_event_attendees: 2,
          attendees: {
            reserves: [1],
            nonReserves: [2],
          },
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.AUTHENTICATION_FAILED);
    });

    it('returns ExceptionDictionary.NOT_AUTHORIZED error code', async () => {
      const res = await makeRequest({
        method: 'PUT',
        url: `/admin/events/${createdEvent.id}`,
        data: {
          name: 'Eighth event',
          description: 'Eighth description',
          starts_at: tomorrow.toISOString(),
          ends_at: tomorrow.toISOString(),
          maximum_event_attendees: 2,
          attendees: {
            reserves: [1],
            nonReserves: [2],
          },
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.NOT_AUTHORIZED);
    });

    it('returns ExceptionDictionary.VALIDATION_ERROR error code', async () => {
      const res = await makeRequest({
        method: 'PUT',
        url: `/admin/events/${createdEvent.id}`,
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        data: {
          name: 'Eighth event',
          description: 'Eighth description',
          starts_at: tomorrow.toISOString(),
          ends_at: tomorrow.toISOString(),
          maximum_event_attendees: 2,
          disallowedParam: 'foo',
          attendees: {
            reserves: [1],
            nonReserves: [2],
          },
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.VALIDATION_ERROR);
    });

    it('returns ExceptionDictionary.VALIDATION_ERROR error code 1', async () => {
      const res = await makeRequest({
        method: 'PUT',
        url: `/admin/events/${createdEvent.id}`,
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        data: {
          name: 'Eighth event',
          description: 'Eighth description',
          starts_at: tomorrow.toISOString(),
          ends_at: tomorrow.toISOString(),
          maximum_event_attendees: '2',
          attendees: {
            reserves: [1],
            nonReserves: [2],
          },
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.VALIDATION_ERROR);
    });

    it('returns ExceptionDictionary.VALIDATION_ERROR error code 2', async () => {
      const res = await makeRequest({
        method: 'PUT',
        url: `/admin/events/${createdEvent.id}`,
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        data: {
          name: 'Eighth event',
          description: 'Eighth description',
          starts_at: tomorrow.toISOString(),
          ends_at: tomorrow.toISOString(),
          maximum_event_attendees: 2,
          attendees: {
            reserves: 1,
            nonReserves: [2],
          },
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.VALIDATION_ERROR);
    });

    it('returns ExceptionDictionary.VALIDATION_ERROR error code 3', async () => {
      const res = await makeRequest({
        method: 'PUT',
        url: `/admin/events/${createdEvent.id}`,
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        data: {
          name: 'Eighth event',
          description: 'Eighth description',
          starts_at: tomorrow.toISOString(),
          ends_at: tomorrow.toISOString(),
          maximum_event_attendees: 2,
          attendees: {
            reserves: ['1'],
            nonReserves: [2],
          },
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.VALIDATION_ERROR);
    });

    it('returns ExceptionDictionary.VALIDATION_ERROR error code 4', async () => {
      const res = await makeRequest({
        method: 'PUT',
        url: `/admin/events/${createdEvent.id}`,
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
        data: {
          name: 'Eighth event',
          description: 'Eighth description',
          starts_at: tomorrow.toISOString(),
          ends_at: tomorrow.toISOString(),
          maximum_event_attendees: 2,
          attendees: {
            reserves: [1],
            nonReserves: [{ foo: 'bar' }],
          },
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.VALIDATION_ERROR);
    });
  });

  describe(':DELETE /admin/events/:id', () => {
    it('deletes an event', async () => {
      const res = await makeRequest({
        method: 'DELETE',
        url: `/admin/events/${createdEvent.id}`,
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.status).toBe(200);

      const currentEventsRes = await makeRequest({
        method: 'GET',
        url: '/admin/events',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      const { data: currentEventsResult } = currentEventsRes;
      expect(currentEventsResult.data).toHaveLength(currentEvents.length);
    });

    it('returns ExceptionDictionary.AUTHENTICATION_FAILED error code', async () => {
      const res = await makeRequest({
        method: 'DELETE',
        url: '/admin/events/1',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.AUTHENTICATION_FAILED);
    });

    it('returns ExceptionDictionary.NOT_AUTHORIZED error code', async () => {
      const res = await makeRequest({
        method: 'DELETE',
        url: '/admin/events/1',
      });

      const { data: result } = res;
      expect(result).toBeDefined();
      expect(result.errorCode).toEqual(ErrorCode.NOT_AUTHORIZED);
    });
  });
});
