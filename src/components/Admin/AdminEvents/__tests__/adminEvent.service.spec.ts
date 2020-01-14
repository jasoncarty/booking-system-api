import { SelectQueryBuilder } from 'typeorm';

import { EventService } from './../../../Public/Event/event.service';
import { SiteSettingsService } from '../../../Public/SiteSettings/siteSettings.service';
import { AdminEventService } from './../adminEvent.service';
import { UserService } from './../../../Public/User/user.service';
import { EventAttendeeService } from './../../../Public/EventAttendee/eventAttendee.service';
import { Event } from './../../../../Repositories/event.entity';
import { EventAttendee } from './../../../../Repositories/eventAttendee.entity';
import {
  mockEvent,
  EventRepositoryMock,
  EventAttendeeRepositoryMock,
  SiteSettingsRepositoryMock,
  appMailer,
  UserRepositoryMock,
  mockUser,
  mockEventAttendee,
  updatedEvent,
} from '../../../../mocks';

describe('AdminEventService', () => {
  let eventService: EventService;
  let siteSettingsService: SiteSettingsService;
  let userService: UserService;
  let eventAttendeeService: EventAttendeeService;
  let adminEventService: AdminEventService;

  beforeEach(() => {
    siteSettingsService = new SiteSettingsService(SiteSettingsRepositoryMock);
    userService = new UserService(UserRepositoryMock, appMailer, siteSettingsService);
    eventAttendeeService = new EventAttendeeService(EventAttendeeRepositoryMock);
    eventService = new EventService(
      EventRepositoryMock,
      eventAttendeeService,
      userService,
    );
    adminEventService = new AdminEventService(
      EventRepositoryMock,
      eventService,
      eventAttendeeService,
      userService,
    );
  });

  describe('getCurrentEvents', () => {
    it('returns an array of events', async () => {
      jest
        .spyOn(eventService, 'getCurrentEvents')
        .mockImplementationOnce(() => Promise.resolve([mockEvent]));

      expect(await adminEventService.getCurrentEvents()).toStrictEqual([mockEvent]);
    });
  });

  describe('getOldEvents', () => {
    it('returns an array of events', async () => {
      jest.spyOn(EventRepositoryMock, 'createQueryBuilder').mockImplementationOnce(
        () =>
          (({
            where: () => ({
              getMany: () => Promise.resolve([mockEvent, mockEvent]),
            }),
          } as unknown) as SelectQueryBuilder<Event>),
      );

      jest
        .spyOn(eventService, 'getEvent')
        .mockImplementation(() => Promise.resolve(mockEvent));

      expect(await adminEventService.getOldEvents()).toStrictEqual([
        mockEvent,
        mockEvent,
      ]);

      jest.restoreAllMocks();
    });

    it('returns an empty array', async () => {
      jest.spyOn(EventRepositoryMock, 'createQueryBuilder').mockImplementationOnce(
        () =>
          (({
            where: () => ({
              getMany: () => Promise.resolve(undefined),
            }),
          } as unknown) as SelectQueryBuilder<Event>),
      );

      expect(await adminEventService.getOldEvents()).toStrictEqual([]);

      jest.restoreAllMocks();
    });

    it('throws an EVENT_FETCHING_ERROR error', async () => {
      jest.spyOn(EventRepositoryMock, 'createQueryBuilder').mockImplementationOnce(
        () =>
          (({
            where: () => ({
              getMany: () => Promise.reject(new Error('khaskjdfh')),
            }),
          } as unknown) as SelectQueryBuilder<Event>),
      );

      await expect(adminEventService.getOldEvents()).rejects.toEqual(
        new Error('An error occured when fetching the events'),
      );
    });
  });

  describe('getEvent', () => {
    it('returns an event object', async () => {
      jest
        .spyOn(eventService, 'getEvent')
        .mockImplementation(() => Promise.resolve(mockEvent));
      jest
        .spyOn(userService, 'getNonAttendees')
        .mockImplementationOnce(() => Promise.resolve([mockUser, mockUser]));

      expect(await adminEventService.getEvent(1)).toStrictEqual({
        ...mockEvent,
        nonAttendees: [mockUser, mockUser],
      });
    });
  });

  describe('addUsers', () => {
    it('adds eventAttendees to users and events', async () => {
      const tempEventMock = { ...mockEvent, eventAttendees: [] };
      const tempUserMock = { ...mockUser, eventAttendees: [] };

      jest
        .spyOn(userService, 'getUser')
        .mockImplementationOnce(() => Promise.resolve(tempUserMock));
      jest
        .spyOn(userService, 'save')
        .mockImplementationOnce(() => Promise.resolve(tempUserMock));
      jest
        .spyOn(EventRepositoryMock, 'save')
        .mockImplementationOnce(() =>
          Promise.resolve((tempEventMock as unknown) as Event),
        );
      jest
        .spyOn(eventAttendeeService, 'createNewEventAttendee')
        .mockImplementationOnce(() =>
          Promise.resolve((mockEventAttendee as unknown) as EventAttendee),
        );

      await adminEventService.addUsers([1], (tempEventMock as unknown) as Event);
      expect(tempEventMock.eventAttendees).toStrictEqual([mockEventAttendee]);
      expect(tempUserMock.eventAttendees).toStrictEqual([mockEventAttendee]);
    });
  });

  describe('createEvent', () => {
    it('returns an event with attendees', async () => {
      jest
        .spyOn(EventRepositoryMock, 'save')
        .mockImplementationOnce(() => Promise.resolve((mockEvent as unknown) as Event));
      jest
        .spyOn(EventRepositoryMock, 'findOne')
        .mockImplementationOnce(() =>
          Promise.resolve(({ ...mockEvent, eventAttendees: [] } as unknown) as Event),
        );
      jest.spyOn(adminEventService, 'addUsers').mockImplementationOnce(jest.fn());
      jest
        .spyOn(adminEventService, 'getEvent')
        .mockImplementationOnce(() => Promise.resolve((mockEvent as unknown) as Event));
      jest.spyOn(userService, 'getAttendees').mockImplementationOnce(() =>
        Promise.resolve({
          reserves: [mockUser, mockUser],
          nonReserves: [mockUser, mockUser],
        }),
      );

      expect(await adminEventService.createEvent(mockEvent)).toStrictEqual({
        ...mockEvent,
        attendees: {
          reserves: [mockUser, mockUser],
          nonReserves: [mockUser, mockUser],
        },
      });
    });

    it('returns an event and adds users', async () => {
      jest
        .spyOn(EventRepositoryMock, 'save')
        .mockImplementationOnce(() => Promise.resolve((mockEvent as unknown) as Event));
      jest
        .spyOn(EventRepositoryMock, 'findOne')
        .mockImplementationOnce(() =>
          Promise.resolve(({ ...mockEvent, eventAttendees: [] } as unknown) as Event),
        );
      jest.spyOn(adminEventService, 'addUsers').mockImplementationOnce(jest.fn());
      jest
        .spyOn(adminEventService, 'getEvent')
        .mockImplementationOnce(() => Promise.resolve((mockEvent as unknown) as Event));
      jest.spyOn(userService, 'getAttendees').mockImplementationOnce(() =>
        Promise.resolve({
          reserves: [mockUser, mockUser],
          nonReserves: [mockUser, mockUser],
        }),
      );

      expect(
        await adminEventService.createEvent({
          ...mockEvent,
          attendees: {
            reserves: [1],
            nonReserves: [2],
          },
        }),
      ).toStrictEqual({
        ...mockEvent,
        attendees: {
          reserves: [mockUser, mockUser],
          nonReserves: [mockUser, mockUser],
        },
      });
    });

    it('returns an event without attendees', async () => {
      jest
        .spyOn(EventRepositoryMock, 'save')
        .mockImplementationOnce(() => Promise.resolve((mockEvent as unknown) as Event));
      jest
        .spyOn(EventRepositoryMock, 'findOne')
        .mockImplementationOnce(() =>
          Promise.resolve(({ ...mockEvent, eventAttendees: [] } as unknown) as Event),
        );
      jest.spyOn(adminEventService, 'addUsers').mockImplementationOnce(jest.fn());
      jest
        .spyOn(adminEventService, 'getEvent')
        .mockImplementationOnce(() => Promise.resolve((mockEvent as unknown) as Event));
      jest.spyOn(userService, 'getAttendees').mockImplementationOnce(() =>
        Promise.resolve({
          reserves: [mockUser, mockUser],
          nonReserves: [mockUser, mockUser],
        }),
      );

      expect(
        await adminEventService.createEvent({
          ...mockEvent,
          attendees: {},
        }),
      ).toStrictEqual({
        ...mockEvent,
        attendees: {
          reserves: [mockUser, mockUser],
          nonReserves: [mockUser, mockUser],
        },
      });
    });
  });

  describe('updateEvent', () => {
    it('returns an event with attendees', async () => {
      jest.spyOn(EventRepositoryMock, 'findOne').mockImplementationOnce(() =>
        Promise.resolve(({
          ...mockEvent,
          eventAttendees: [mockEventAttendee],
        } as unknown) as Event),
      );
      jest
        .spyOn(EventRepositoryMock, 'update')
        .mockImplementationOnce(() => updatedEvent);
      jest
        .spyOn(eventAttendeeService, 'deleteEventAttendee')
        .mockImplementationOnce(
          () => (Promise.resolve(mockEventAttendee) as unknown) as Promise<EventAttendee>,
        );
      jest.spyOn(adminEventService, 'addUsers').mockImplementationOnce(jest.fn());
      jest
        .spyOn(adminEventService, 'getEvent')
        .mockImplementationOnce(() => Promise.resolve((mockEvent as unknown) as Event));
      jest.spyOn(userService, 'getAttendees').mockImplementationOnce(() =>
        Promise.resolve({
          reserves: [mockUser, mockUser],
          nonReserves: [mockUser, mockUser],
        }),
      );

      expect(await adminEventService.updateEvent(1, mockEvent)).toStrictEqual({
        ...mockEvent,
        attendees: {
          reserves: [mockUser, mockUser],
          nonReserves: [mockUser, mockUser],
        },
      });
    });

    it('returns an event and adds users', async () => {
      jest
        .spyOn(EventRepositoryMock, 'findOne')
        .mockImplementationOnce(() =>
          Promise.resolve(({ ...mockEvent, eventAttendees: [] } as unknown) as Event),
        );
      jest
        .spyOn(EventRepositoryMock, 'update')
        .mockImplementationOnce(() => updatedEvent);
      jest.spyOn(adminEventService, 'addUsers').mockImplementationOnce(jest.fn());
      jest
        .spyOn(adminEventService, 'getEvent')
        .mockImplementationOnce(() => Promise.resolve((mockEvent as unknown) as Event));
      jest.spyOn(userService, 'getAttendees').mockImplementationOnce(() =>
        Promise.resolve({
          reserves: [mockUser, mockUser],
          nonReserves: [mockUser, mockUser],
        }),
      );

      expect(
        await adminEventService.updateEvent(1, {
          ...mockEvent,
          attendees: {
            reserves: [1],
            nonReserves: [2],
          },
        }),
      ).toStrictEqual({
        ...mockEvent,
        attendees: {
          reserves: [mockUser, mockUser],
          nonReserves: [mockUser, mockUser],
        },
      });
    });

    it('returns an event without attendees', async () => {
      jest
        .spyOn(EventRepositoryMock, 'findOne')
        .mockImplementationOnce(() =>
          Promise.resolve(({ ...mockEvent, eventAttendees: [] } as unknown) as Event),
        );
      jest
        .spyOn(EventRepositoryMock, 'update')
        .mockImplementationOnce(() => updatedEvent);
      jest.spyOn(adminEventService, 'addUsers').mockImplementationOnce(jest.fn());
      jest
        .spyOn(adminEventService, 'getEvent')
        .mockImplementationOnce(() => Promise.resolve((mockEvent as unknown) as Event));
      jest.spyOn(userService, 'getAttendees').mockImplementationOnce(() =>
        Promise.resolve({
          reserves: [mockUser, mockUser],
          nonReserves: [mockUser, mockUser],
        }),
      );

      expect(
        await adminEventService.updateEvent(1, {
          ...mockEvent,
          attendees: {},
        }),
      ).toStrictEqual({
        ...mockEvent,
        attendees: {
          reserves: [mockUser, mockUser],
          nonReserves: [mockUser, mockUser],
        },
      });
    });
  });

  describe('deleteEvent', () => {
    it('returns the deleted event', async () => {
      jest
        .spyOn(EventRepositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.resolve((mockEvent as unknown) as Event));
      jest
        .spyOn(EventRepositoryMock, 'remove')
        .mockImplementationOnce(() => Promise.resolve((mockEvent as unknown) as Event));
      expect(await adminEventService.deleteEvent(1)).toStrictEqual(mockEvent);
    });
  });
});
