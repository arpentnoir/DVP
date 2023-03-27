import { isValidABN } from './abn';
describe('isValidABN', () => {
  it.each`
    abn                  | valid
    ${null}              | ${false}
    ${'faketext'}        | ${false}
    ${'32635864970test'} | ${false}
    ${'41 824 753 556'}  | ${false}
    ${'123'}             | ${false}
    ${12345678901}       | ${false}
    ${32635864970}       | ${true}
    ${'32 635 864 970'}  | ${true}
    ${'32-635-864-970'}  | ${true}
  `(
    'returns $valid for $abn',
    ({ abn, valid }: { abn: string | number; valid: boolean }) => {
      expect(isValidABN(abn)).toBe(valid);
    }
  );
});
