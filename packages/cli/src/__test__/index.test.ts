import { getCommandName } from '../utils';

test('getCommandName', () => {
  expect(getCommandName('jenkins [aaa]')).toBe('jenkins');
});
