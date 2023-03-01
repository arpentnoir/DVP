import { getEpochTimeStamp } from './date';

describe('date utils', () => {
  describe('getEpochTimeStamp', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

    it.each`
      date                                                                               | expected
      ${new Date('2023-01-01')}                                                          | ${1672531200}
      ${null}                                                                            | ${1577836800}
      ${new Date(new Date('2023-10-01').setDate(new Date('2023-10-01').getDate() + 30))} | ${1698710400}
    `(
      'returns $expected for $date',
      ({ date, expected }: { date?: Date; expected: number }) => {
        expect(getEpochTimeStamp(date)).toBe(expected);
      }
    );

    it('should check if the input value of date type', () => {
      expect(() => {
        getEpochTimeStamp({} as never);
      }).toThrow(new Error('invalid date'));
    });
  });
});
