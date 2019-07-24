import { Colours } from './colours.enum';
import { default as chalk } from 'chalk';

export const echoMessage = (color: Colours, msg: string): void => {
  console.log(chalk[color]('# ----------------------------------'));
  console.log(chalk[color](`# ${msg}`));
  console.log(chalk[color]('# ----------------------------------'));
};
