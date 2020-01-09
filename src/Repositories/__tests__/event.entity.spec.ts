import { relationType, relation } from './../event.entity';
import { EventAttendee } from './../eventAttendee.entity';

describe('Event', () => {
  describe('relationType', () => {
    it('returns an EventAttendee', () => {
      expect(relationType('1')).toEqual(EventAttendee);
    });
  });

  describe('relation', () => {
    it('returns an eventAttendee.event', () => {
      const eventAttendee = { event: '1' };
      expect(relation(eventAttendee)).toEqual('1');
    });
  });
});
