import {
  userRelation,
  userRelationType,
  eventRelation,
  eventRelationType,
} from './../eventAttendee.entity';
import { User } from './../user.entity';
import { Event } from './../event.entity';

describe('EventAttendee', () => {
  describe('userRelationType', () => {
    it('returns an EventAttendee', () => {
      expect(userRelationType('1')).toEqual(User);
    });
  });

  describe('userRelation', () => {
    it('returns an eventAttendee.event', () => {
      const user = { eventAttendees: '1' };
      expect(userRelation(user)).toEqual('1');
    });
  });

  describe('eventRelationType', () => {
    it('returns an EventAttendee', () => {
      expect(eventRelationType('1')).toEqual(Event);
    });
  });

  describe('eventRelation', () => {
    it('returns an eventAttendee.event', () => {
      const event = { eventAttendees: '1' };
      expect(eventRelation(event)).toEqual('1');
    });
  });
});
