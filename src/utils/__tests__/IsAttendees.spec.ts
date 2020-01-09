import { ValidatorConstraintInterface } from 'class-validator';
import { IsAttendees, VALID_INPUT } from './../IsAttendees';
import { AttendeeIdsDto } from './../../proto';

describe('IsAttendees', () => {
  let isAttendees: IsAttendees;

  beforeEach(() => {
    isAttendees = new IsAttendees();
  });

  describe('validate', () => {
    it('returns false if reserves is not an array', () => {
      expect(
        isAttendees.validate(({ reserves: 1 } as unknown) as AttendeeIdsDto),
      ).toBeFalsy();
      expect(
        isAttendees.validate(({ reserves: '1' } as unknown) as AttendeeIdsDto),
      ).toBeFalsy();
    });

    it('returns false if nonReserves is not an array', () => {
      expect(
        isAttendees.validate(({ nonReserves: 1 } as unknown) as AttendeeIdsDto),
      ).toBeFalsy();
      expect(
        isAttendees.validate(({ nonReserves: '1' } as unknown) as AttendeeIdsDto),
      ).toBeFalsy();
    });

    it('returns false if reserves or nonReserves contains NaN', () => {
      expect(
        isAttendees.validate(({ reserves: ['1'] } as unknown) as AttendeeIdsDto),
      ).toBeFalsy();
      expect(
        isAttendees.validate(({
          reserves: [{ foo: 'bar' }],
        } as unknown) as AttendeeIdsDto),
      ).toBeFalsy();
      expect(
        isAttendees.validate(({
          reserves: [1],
          nonReserves: [{ foo: 'bar' }],
        } as unknown) as AttendeeIdsDto),
      ).toBeFalsy();
    });

    it('returns true if reserves or nonReserves is an array of numbers', () => {
      expect(
        isAttendees.validate(({ reserves: [1] } as unknown) as AttendeeIdsDto),
      ).toBeTruthy();
      expect(
        isAttendees.validate(({ nonReserves: [1, 3, 5] } as unknown) as AttendeeIdsDto),
      ).toBeTruthy();
    });
  });

  describe('defaultMessage', () => {
    it('returns a string', () => {
      expect(isAttendees.defaultMessage()).toStrictEqual(
        `Invalid input for attendees: example of valid input: ${JSON.stringify(
          VALID_INPUT,
        )}`,
      );
    });
  });
});
