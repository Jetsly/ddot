import { getAllCli, getCommandName } from '../utils';

test('getCommandName', () => {
  expect(getCommandName('jenkins [aaa]')).toBe('jenkins');
});

test('getAllCli', () => {
  expect(getAllCli()).toEqual([]);
});
 