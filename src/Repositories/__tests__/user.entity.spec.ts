import { relationType, relation } from './../user.entity';
import { EventAttendee } from './../eventAttendee.entity';

describe('User', () => {
  describe('relationType', () => {
    it('returns an EventAttendee', () => {
      expect(relationType('1')).toEqual(EventAttendee);
    });
  });

  describe('relation', () => {
    it('returns an eventAttendee.event', () => {
      const eventAttendee = { user: '1' };
      expect(relation(eventAttendee)).toEqual('1');
    });
  });
});
