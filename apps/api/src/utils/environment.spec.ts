import { getEnv } from './environment';

const variables = ['CLIENT', 'SECRET'];

describe('environment', () => {
  const OLD_ENV = process.env;
  describe('getEnv', () => {
    afterEach(() => {
      process.env = OLD_ENV;
    });
    it('should pass the check when variables are defined', () => {
      process.env = {
        CLIENT: 'Postman',
        SECRET: 'Pat',
      };

      expect(getEnv(variables)).toStrictEqual({
        CLIENT: 'Postman',
        SECRET: 'Pat',
      });
    });
    it('should throw an error specifying missing variable(s) when variables are not defined', () => {
      process.env = {
        CLIENT: 'Postman',
      };

      expect(() => getEnv(variables)).toThrow(
        'Missing the following required environment variable(s): SECRET'
      );
    });
  });
});
