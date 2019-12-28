import { Request } from 'express';

import { EventController } from '../event.controller';
import { EventService } from '../event.service';
import { UserService } from './../../User/user.service';
import { EventAttendeeService } from './../../EventAttendee/eventAttendee.service';
import {
  mockEvent,
  EventRepositoryMock,
  singleEvent,
  EventAttendeeRepositoryMock,
  appMailer,
  UserRepositoryMock,
} from '../../../../mocks/index';

describe('EventController', () => {
  let eventService: EventService;
  let eventController: EventController;
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
    eventController = new EventController(eventService);
  });

  describe(':GET /', () => {
    it('Returns all current events', async () => {
      jest
        .spyOn(eventService, 'getCurrentEvents')
        .mockImplementationOnce(() => Promise.resolve([mockEvent, mockEvent]));
      expect(await eventController.getCurrentEvents()).toStrictEqual([
        mockEvent,
        mockEvent,
      ]);
    });
  });

  describe(':GET /:id', () => {
    it('Returns a single event', async () => {
      jest.spyOn(eventService, 'getEvent').mockImplementationOnce(() => singleEvent);
      expect(await eventController.getEvent(1)).toStrictEqual(await singleEvent);
    });
  });

  describe(':POST /book/:id', () => {
    it('Returns a single event', async () => {
      const request = ({
        headers: {
          authorization: 'Bearer lkajsdfölkjasdf',
        },
      } as unknown) as Request;
      jest.spyOn(eventService, 'bookEvent').mockImplementationOnce(() => singleEvent);
      expect(await eventController.bookEvent(1, request)).toStrictEqual(
        await singleEvent,
      );
    });
  });

  describe(':POST /cancel/:id', () => {
    it('Returns an event', async () => {
      const request = ({
        headers: {
          authorization: 'Bearer lkajsdfölkjasdf',
        },
      } as unknown) as Request;
      jest
        .spyOn(eventService, 'cancelEventBooking')
        .mockImplementationOnce(() => singleEvent);
      expect(await eventController.cancelEventBooking(1, request)).toStrictEqual(
        await singleEvent,
      );
    });
  });
});
