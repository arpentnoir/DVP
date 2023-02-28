import { capitaliseFirstLetter, constructPath } from './string.utils';

describe('String Utils', () => {
  describe('Capitalise First Letter', () => {
    it('should return a string with the first letter capitalised', () => {
      expect(capitaliseFirstLetter('testString')).toBe('TestString');
    });

    it('should return an empty string if an empty string is passed in', () => {
      expect(capitaliseFirstLetter('')).toBe('');
    });
  });

  describe('Construct Path', () => {
    const path = '/test/construct/path';

    it('should return a path constructed from an array of strings', () => {
      expect(constructPath(path.split('/'))).toBe(path);
    });
  });
});
