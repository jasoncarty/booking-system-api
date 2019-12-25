import { SelectQueryBuilder } from 'typeorm';

import { EventService } from './../event.service';
import { UserService } from './../../User/user.service';
import { EventAttendeeService } from './../../EventAttendee/eventAttendee.service';
import { Event } from './../../../../Repositories/event.entity';
import { EventAttendee } from './../../../../Repositories/eventAttendee.entity';
import { ErrorCode } from '../../../../proto';
import {
  mockEvent,
  EventRepositoryMock,
  singleEvent,
  EventAttendeeRepositoryMock,
  appMailer,
  UserRepositoryMock,
  mockUser,
  mockEventAttendee,
} from '../../../../mocks/index';

describe('EventService', () => {
  let eventService: EventService;
  let userService: UserService;
  let eventAttendeeService: EventAttendeeService;

  beforeEach(() => {
    userService = new UserService(UserRepositoryMock, appMailer);
    eventAttendeeService = new EventAttendeeService(EventAttendeeRepositoryMock);
    eventService = new EventService(
      EventRepositoryMock,
      eventAttendeeService,
      userService,
    );
  });

  describe('getEvent', () => {
    it('returns an event', async () => {
      jest
        .spyOn(EventRepositoryMock, 'findOne')
        .mockImplementationOnce(() => (singleEvent as unknown) as Promise<Event>);
      expect(await eventService.getEvent(1)).toStrictEqual(mockEvent);
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
              getMany: () => Promise.resolve([mockEvent, mockEvent]),
            }),
          } as unknown) as SelectQueryBuilder<Event>),
      );

      expect(await eventService.getCurrentEvents()).toStrictEqual([mockEvent, mockEvent]);
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

      expect(await eventService.bookEvent(1, 'lkasjdf')).toEqual({
        ...mockEvent,
        eventAttendees: [],
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
});
