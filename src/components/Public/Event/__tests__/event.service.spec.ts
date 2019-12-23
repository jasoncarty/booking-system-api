import { SelectQueryBuilder } from 'typeorm';

import { EventService } from './../event.service';
import { Event } from './../../../../Repositories/event.entity';
import { ErrorCode } from '../../../../proto';
import { mockEvent, EventRepositoryMock, singleEvent } from '../../../../mocks/index';

describe('EventService', () => {
  let eventService: EventService;

  beforeEach(() => {
    eventService = new EventService(EventRepositoryMock);
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
});
