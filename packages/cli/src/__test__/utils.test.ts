import { isFunction } from '../utils';

test('isFunction', () => {
  expect(isFunction(()=>null)).toBe(true);
  expect(isFunction('jenkins [aaa]')).toBe(false);
});

