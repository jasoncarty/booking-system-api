import { SelectQueryBuilder } from 'typeorm';

import {
  EventAttendeeRepositoryMock,
  EventRepositoryMock,
  UserRepositoryMock,
  appMailer,
  mockEvent,
  mockEventAttendee,
  mockUser,
  singleEvent,
  SiteSettingsRepositoryMock,
} from '../../../../mocks';
import { ErrorCode } from '../../../../dto';
import { Event } from './../../../../Repositories/event.entity';
import { EventAttendee } from './../../../../Repositories/eventAttendee.entity';
import { EventAttendeeService } from './../../EventAttendee/eventAttendee.service';
import { EventService } from './../event.service';
import { User } from './../../../../Repositories/user.entity';
import { UserService } from './../../User/user.service';
import { SiteSettingsService } from '../../SiteSettings/siteSettings.service';

describe('EventService', () => {
  let eventService: EventService;
  let userService: UserService;
  let siteSettingsService: SiteSettingsService;
  let eventAttendeeService: EventAttendeeService;

  beforeEach(() => {
    siteSettingsService = new SiteSettingsService(SiteSettingsRepositoryMock);
    userService = new UserService(UserRepositoryMock, appMailer, siteSettingsService);
    eventAttendeeService = new EventAttendeeService(EventAttendeeRepositoryMock);
    eventService = new EventService(
      EventRepositoryMock,
      eventAttendeeService,
      userService,
    );
  });

  describe('findAndRemoveItem', () => {
    it('removes an item from an array', () => {
      const array = [{ id: 1 }, { id: 2 }, { id: 3 }];
      expect(eventService['findAndRemoveItem'](array, 2)).toStrictEqual([
        { id: 1 },
        { id: 3 },
      ]);
    });

    it('does not remove an item from the array', () => {
      const array = [{ id: 1 }, { id: 2 }, { id: 3 }];
      expect(eventService['findAndRemoveItem'](array, 4)).toStrictEqual([
        { id: 1 },
        { id: 2 },
        { id: 3 },
      ]);
    });
  });

  describe('getEvent', () => {
    it('returns an event', async () => {
      jest
        .spyOn(EventRepositoryMock, 'findOne')
        .mockImplementationOnce(() => (singleEvent as unknown) as Promise<Event>);
      jest
        .spyOn(userService, 'getAttendees')
        .mockImplementationOnce(() =>
          Promise.resolve({ reserves: [mockUser], nonReserves: [mockUser] }),
        );

      expect(await eventService.getEvent(1)).toStrictEqual({
        ...mockEvent,
        attendees: { reserves: [mockUser], nonReserves: [mockUser] },
      });
    });

    it('throws an EVENT_NOT_FOUND error', async () => {
      jest
        .spyOn(EventRepositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.reject(new Error('khkjahsd')));

      try {
        await eventService.getEvent(1);
        throw new Error('test failed');
      } catch (e) {
        expect(e.errorCode).toEqual(ErrorCode.EVENT_NOT_FOUND);
      }
    });

    it('throws an EVENT_NOT_FOUND error 2', async () => {
      jest
        .spyOn(EventRepositoryMock, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(undefined));

      try {
        await eventService.getEvent(1);
        throw new Error('test failed');
      } catch (e) {
        expect(e.errorCode).toEqual(ErrorCode.EVENT_NOT_FOUND);
      }
    });
  });

  describe('getCurrentEvents', () => {
    it('returns an array of events', async () => {
      jest.spyOn(EventRepositoryMock, 'createQueryBuilder').mockImplementationOnce(
        () =>
          (({
            where: () => ({
              orderBy: () => ({
                getMany: () => Promise.resolve([mockEvent, mockEvent]),
              }),
            }),
          } as unknown) as SelectQueryBuilder<Event>),
      );

      jest
        .spyOn(eventService, 'getEvent')
        .mockImplementation(() => Promise.resolve(mockEvent));

      expect(await eventService.getCurrentEvents()).toStrictEqual([mockEvent, mockEvent]);
    });

    it('returns an empty array', async () => {
      jest.spyOn(EventRepositoryMock, 'createQueryBuilder').mockImplementationOnce(
        () =>
          (({
            where: () => ({
              orderBy: () => ({
                getMany: () => Promise.resolve(undefined),
              }),
            }),
          } as unknown) as SelectQueryBuilder<Event>),
      );

      expect(await eventService.getCurrentEvents()).toStrictEqual([]);
    });

    it('throws an EVENT_FETCHING_ERROR error', async () => {
      jest.spyOn(EventRepositoryMock, 'createQueryBuilder').mockImplementationOnce(
        () =>
          (({
            where: () => ({
              getMany: () => Promise.reject(new Error('kjhasfhas')),
            }),
          } as unknown) as SelectQueryBuilder<Event>),
      );

      try {
        await eventService.getCurrentEvents();
        throw new Error('The test failed');
      } catch (e) {
        expect(e.errorCode).toBe(ErrorCode.EVENT_FETCHING_ERROR);
      }
    });
  });

  describe('fetchEventWithAttendees', () => {
    it('loads events with eventAttendees', async () => {
      jest
        .spyOn(EventRepositoryMock, 'findOne')
        .mockImplementationOnce(() => (singleEvent as unknown) as Promise<Event>);
      expect(await eventService.fetchEventWithAttendees(1)).toEqual(await singleEvent);
    });
  });

  describe('bookEvent', () => {
    it('adds eventAttendees to the event', async () => {
      jest.spyOn(userService, 'getProfile').mockImplementationOnce(() =>
        Promise.resolve({
          ...mockUser,
          eventAttendees: [],
        }),
      );
      jest.spyOn(eventService, 'fetchEventWithAttendees').mockImplementation(() =>
        Promise.resolve(({
          ...mockEvent,
          eventAttendees: [],
        } as unknown) as Promise<Event>),
      );
      jest
        .spyOn(eventService, 'getEvent')
        .mockImplementation(() => Promise.resolve(mockEvent));
      jest
        .spyOn(eventAttendeeService, 'createNewEventAttendee')
        .mockImplementationOnce(
          () => (Promise.resolve(mockEventAttendee) as unknown) as Promise<EventAttendee>,
        );
      jest
        .spyOn(userService, 'save')
        .mockImplementationOnce(() => Promise.resolve(mockUser));
      jest
        .spyOn(EventRepositoryMock, 'save')
        .mockImplementationOnce(
          () => (Promise.resolve(mockEvent) as unknown) as Promise<Event>,
        );
      jest
        .spyOn(userService, 'getAttendees')
        .mockImplementationOnce(() =>
          Promise.resolve({ reserves: [mockUser], nonReserves: [mockUser] }),
        );

      expect(await eventService.bookEvent(1, 'lkasjdf')).toEqual({
        ...mockEvent,
        attendees: { reserves: [mockUser], nonReserves: [mockUser] },
      });
    });

    it('throws an EVENT_BOOKING_ERROR', async () => {
      jest
        .spyOn(userService, 'getProfile')
        .mockImplementationOnce(() => Promise.resolve(undefined));
      jest.spyOn(eventService, 'fetchEventWithAttendees').mockImplementation(() =>
        Promise.resolve(({
          ...mockEvent,
          eventAttendees: [],
        } as unknown) as Promise<Event>),
      );

      try {
        await eventService.bookEvent(1, 'lkasjdf');
        throw new Error('Test failed');
      } catch (err) {
        expect(err.errorCode).toEqual(ErrorCode.EVENT_BOOKING_ERROR);
      }
    });
  });

  describe('cancelEventBooking', () => {
    it('returns an event', async () => {
      jest.spyOn(userService, 'getProfile').mockImplementationOnce(() =>
        Promise.resolve(({
          ...mockUser,
          eventAttendees: [mockEventAttendee],
        } as unknown) as User),
      );
      jest.spyOn(eventService, 'fetchEventWithAttendees').mockImplementation(() =>
        Promise.resolve(({
          ...mockEvent,
          eventAttendees: [mockEventAttendee],
        } as unknown) as Promise<Event>),
      );
      jest
        .spyOn(eventAttendeeService, 'findEventAttendee')
        .mockImplementationOnce(
          () => (Promise.resolve(mockEventAttendee) as unknown) as Promise<EventAttendee>,
        );
      jest
        .spyOn(eventAttendeeService, 'deleteEventAttendee')
        .mockImplementationOnce(
          () => (Promise.resolve(mockEventAttendee) as unknown) as Promise<EventAttendee>,
        );
      jest
        .spyOn(userService, 'save')
        .mockImplementationOnce(() => Promise.resolve(mockUser));
      jest
        .spyOn(EventRepositoryMock, 'save')
        .mockImplementationOnce(
          () => (Promise.resolve(mockEvent) as unknown) as Promise<Event>,
        );
      jest
        .spyOn(eventService, 'getEvent')
        .mockImplementation(() => Promise.resolve(mockEvent));
      jest
        .spyOn(userService, 'getAttendees')
        .mockImplementationOnce(() =>
          Promise.resolve({ reserves: [mockUser], nonReserves: [mockUser] }),
        );

      expect(await eventService.cancelEventBooking(1, 'lkasjdf')).toEqual({
        ...mockEvent,
        attendees: { reserves: [mockUser], nonReserves: [mockUser] },
      });
    });

    it('throws an EVENT_CANCEL_ERROR', async () => {
      jest
        .spyOn(userService, 'getProfile')
        .mockImplementationOnce(() => Promise.resolve(undefined));
      jest.spyOn(eventService, 'fetchEventWithAttendees').mockImplementation(() =>
        Promise.resolve(({
          ...mockEvent,
          eventAttendees: [],
        } as unknown) as Promise<Event>),
      );

      try {
        await eventService.cancelEventBooking(1, 'lkasjdf');
        throw new Error('Test failed');
      } catch (err) {
        expect(err.errorCode).toEqual(ErrorCode.EVENT_CANCEL_ERROR);
      }
    });
  });
});
