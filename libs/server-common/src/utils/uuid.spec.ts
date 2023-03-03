import { getUuId, getUuIdFromUrn } from './uuid';

describe('getUuId', () => {
  it('should return uuid', () => {
    expect(getUuId()).toBeDefined();
  });
});

describe('getUuIdFromUrn', () => {
  it('should return uuid from urn', () => {
    const urn = 'urn:uuid:6cc2c9c8-f1cc-4ebc-b1b8-e420afd115bb';

    expect(getUuIdFromUrn(urn)).toStrictEqual(
      '6cc2c9c8-f1cc-4ebc-b1b8-e420afd115bb'
    );
  });

  it('should return undefined if urn is not valid', () => {
    let urn = 'urn:uuid:6cc2c9c8-f1cc-4ebc-b1b8-not-valid';

    expect(getUuIdFromUrn(urn)).toBeUndefined();

    urn = '';

    expect(getUuIdFromUrn(urn)).toBeUndefined();
  });
});
