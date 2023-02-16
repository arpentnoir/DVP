import { decode, encode } from './base64';
describe('base64', () => {
  describe('encode', () => {
    it('should encode the string to base64', () => {
      expect(encode('test')).toBeDefined();
    });

    describe('decode', () => {
      it('should encode the string to base64', () => {
        const base64Str = encode('test');
        expect(decode(base64Str)).toBe('test');
      });
    });
  });
});
