/* eslint-disable @typescript-eslint/camelcase */
import { EventAttendeeService } from './../eventAttendee.service';
import {
  EventAttendeeRepositoryMock,
  mockEvent,
  mockEventAttendee,
  mockUser,
} from './../../../../mocks';
import { Event } from './../../../../Repositories/event.entity';
import { EventAttendee } from './../../../../Repositories/eventAttendee.entity';
import { ErrorCode } from '../../../../proto';

describe('EventAttendeeService', () => {
  let eventAttendeeService: EventAttendeeService;

  beforeEach(() => {
    eventAttendeeService = new EventAttendeeService(EventAttendeeRepositoryMock);
  });

  describe('getReserve', () => {
    it('returns truthy', () => {
      const event = ({
        ...mockEvent,
        eventAttendees: [],
      } as unknown) as Event;

      expect(eventAttendeeService.getReserve(event)).toEqual(false);
    });

    it('returns falsey', () => {
      const event = ({
        ...mockEvent,
        maximum_event_attendees: 0,
        eventAttendees: [],
      } as unknown) as Event;

      expect(eventAttendeeService.getReserve(event)).toEqual(true);
    });
  });

  describe('createNewEventAttendee', () => {
    const event = ({
      ...mockEvent,
      maximum_event_attendees: 0,
      eventAttendees: [],
    } as unknown) as Event;

    it('creates a new eventAttendee', async () => {
      jest
        .spyOn(EventAttendeeRepositoryMock, 'find')
        .mockImplementationOnce(() => Promise.resolve(undefined));

      jest
        .spyOn(EventAttendeeRepositoryMock, 'save')
        .mockImplementationOnce(() =>
          Promise.resolve((mockEventAttendee as unknown) as EventAttendee),
        );

      expect(await eventAttendeeService.createNewEventAttendee(mockUser, event)).toEqual(
        mockEventAttendee,
      );
    });

    it('throws a DUPLICATE_EVENT_ATTENDEE_ERROR error', async () => {
      jest
        .spyOn(EventAttendeeRepositoryMock, 'find')
        .mockImplementationOnce(() =>
          Promise.resolve([(mockEventAttendee as unknown) as EventAttendee]),
        );

      try {
        await eventAttendeeService.createNewEventAttendee(mockUser, event);
        throw new Error('Test failed');
      } catch (err) {
        expect(err.errorCode).toEqual(ErrorCode.DUPLICATE_EVENT_ATTENDEE_ERROR);
      }
    });

    it('throws a EVENT_ATTENDEE_CREATION_ERROR error', async () => {
      jest
        .spyOn(EventAttendeeRepositoryMock, 'find')
        .mockImplementationOnce(() => Promise.resolve(undefined));

      jest
        .spyOn(EventAttendeeRepositoryMock, 'save')
        .mockImplementationOnce(() => Promise.reject(new Error('sdfsf')));

      try {
        await eventAttendeeService.createNewEventAttendee(mockUser, event);
        throw new Error('Test failed');
      } catch (err) {
        expect(err.errorCode).toEqual(ErrorCode.EVENT_ATTENDEE_CREATION_ERROR);
      }
    });
  });
});
