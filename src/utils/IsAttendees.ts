import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { AttendeeIdsDto } from '../dto';

export const VALID_INPUT = {
  attendees: {
    reserves: [1, 3],
    nonReserves: [2, 4],
  },
};

@ValidatorConstraint({ name: 'isAttendeeIds', async: false })
export class IsAttendees implements ValidatorConstraintInterface {
  validate(attendees: AttendeeIdsDto): boolean {
    if (attendees.reserves) {
      if (!Array.isArray(attendees.reserves)) {
        return false;
      }
    }

    if (attendees.nonReserves) {
      if (!Array.isArray(attendees.nonReserves)) {
        return false;
      }
    }

    const { reserves = [], nonReserves = [] } = attendees;
    const mixedAttendees = [...reserves, ...nonReserves];
    let result = true;
    for (let i = 0; i < mixedAttendees.length; i++) {
      if (typeof mixedAttendees[i] !== 'number') {
        result = false;
        break;
      }
    }
    return result;
  }

  defaultMessage(): string {
    return `Invalid input for attendees: example of valid input: ${JSON.stringify(
      VALID_INPUT,
    )}`;
  }
}
