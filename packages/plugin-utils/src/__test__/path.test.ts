import { path } from '../path';

beforeAll(() => {
  process.chdir('/');
});

test('path cwd', () => {
  expect(path.cwd).toBe('/');
});

test('path absSrcPath', () => {
  expect(path.absSrcPath).toBe('/src');
});

test('path absTmpDirPath', () => {
  expect(path.absTmpDirPath).toBe('/src/.ddot');
});

test('path absPagesPath', () => {
  expect(path.absPagesPath).toBe('/src/pages');
});
