import { SelectQueryBuilder } from 'typeorm';

import { EventService } from './../../../Public/Event/event.service';
import { AdminEventService } from './../adminEvent.service';
import { UserService } from './../../../Public/User/user.service';
import { EventAttendeeService } from './../../../Public/EventAttendee/eventAttendee.service';
import { Event } from './../../../../Repositories/event.entity';
import {
  mockEvent,
  EventRepositoryMock,
  EventAttendeeRepositoryMock,
  appMailer,
  UserRepositoryMock,
  mockUser,
} from '../../../../mocks';

describe('AdminEventService', () => {
  let eventService: EventService;
  let userService: UserService;
  let eventAttendeeService: EventAttendeeService;
  let adminEventService: AdminEventService;

  beforeEach(() => {
    userService = new UserService(UserRepositoryMock, appMailer);
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
});
