import {
  EventAttendeeRepositoryMock,
  EventRepositoryMock,
  UserRepositoryMock,
  SiteSettingsRepositoryMock,
  appMailer,
  mockEvent,
} from './../../../../mocks';
import { EventCreateDto, EventUpdateDto } from '../../../../dto';
import { AdminEventController } from './../adminEvent.controller';
import { AdminEventService } from './../adminEvent.service';
import { EventAttendeeService } from './../../../Public/EventAttendee/eventAttendee.service';
import { EventService } from './../../../Public/Event/event.service';
import { UserService } from './../../../Public/User/user.service';
import { SiteSettingsService } from '../../../Public/SiteSettings/siteSettings.service';

describe('AdminEventController', () => {
  let userService: UserService;
  let siteSettingsService: SiteSettingsService;
  let adminEventController: AdminEventController;
  let adminEventService: AdminEventService;
  let eventService: EventService;
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
    adminEventService = new AdminEventService(
      EventRepositoryMock,
      eventService,
      eventAttendeeService,
      userService,
    );
    adminEventController = new AdminEventController(adminEventService);
  });

  describe(':GET /admin/events', () => {
    it('returns all current events', async () => {
      jest
        .spyOn(adminEventService, 'getCurrentEvents')
        .mockImplementationOnce(() => Promise.resolve([mockEvent]));

      expect(await adminEventController.getCurrentEvents()).toStrictEqual([mockEvent]);
    });
  });

  describe(':GET /admin/events/old', () => {
    it('returns all current events', async () => {
      jest
        .spyOn(adminEventService, 'getOldEvents')
        .mockImplementationOnce(() => Promise.resolve([mockEvent]));

      expect(await adminEventController.getOldEvents()).toStrictEqual([mockEvent]);
    });
  });

  describe(':GET /admin/events/:id', () => {
    it('returns all current events', async () => {
      jest
        .spyOn(adminEventService, 'getEvent')
        .mockImplementationOnce(() => Promise.resolve(mockEvent));

      expect(await adminEventController.getEvent(1)).toStrictEqual(mockEvent);
    });
  });

  describe(':POST /admin/events/create', () => {
    it('creates an event', async () => {
      jest
        .spyOn(adminEventService, 'createEvent')
        .mockImplementationOnce(() => Promise.resolve(mockEvent));

      expect(
        await adminEventController.createEvent(({
          ...mockEvent,
          id: null,
        } as unknown) as EventCreateDto),
      ).toStrictEqual(mockEvent);
    });
  });

  describe(':PUT /admin/events/:id', () => {
    it('creates an event', async () => {
      jest
        .spyOn(adminEventService, 'updateEvent')
        .mockImplementationOnce(() => Promise.resolve(mockEvent));

      expect(
        await adminEventController.updateEvent(
          1,
          (mockEvent as unknown) as EventUpdateDto,
        ),
      ).toStrictEqual(mockEvent);
    });
  });

  describe(':DELETE /admin/events/:id', () => {
    it('returns an event', async () => {
      jest
        .spyOn(adminEventService, 'deleteEvent')
        .mockImplementationOnce(() => Promise.resolve(mockEvent));

      expect(await adminEventController.deleteEvent(1)).toStrictEqual(mockEvent);
    });
  });
});
