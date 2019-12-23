import { EventController } from '../event.controller';
import { EventService } from '../event.service';
import { mockEvent, EventRepositoryMock, singleEvent } from '../../../../mocks/index';

describe('EventController', () => {
  let eventService: EventService;
  let eventController: EventController;

  beforeEach(() => {
    eventService = new EventService(EventRepositoryMock);
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
    it('Returns all current events', async () => {
      jest.spyOn(eventService, 'getEvent').mockImplementationOnce(() => singleEvent);
      expect(await eventController.getEvent(1)).toStrictEqual(await singleEvent);
    });
  });
});
