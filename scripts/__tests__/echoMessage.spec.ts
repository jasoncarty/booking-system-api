import { echoMessage } from './../echoMessage';
import { Colours } from './../colours.enum';
import { default as chalk } from 'chalk';

describe('echoMessage', () => {
  it('calls console.log 3 times', () => {
    const logSpy = jest.fn();
    console.log = logSpy;
    echoMessage(Colours.green, 'Hello there');
    expect(console.log).toHaveBeenCalledTimes(3);
    expect(console.log).toHaveBeenNthCalledWith(2, chalk.green('# Hello there'));
  });
});
