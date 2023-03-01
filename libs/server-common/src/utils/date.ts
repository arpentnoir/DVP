import util from 'util';
/**
 *  unix epoch timestamp
 * @returns current epoch time
 */
export const getEpochTimeStamp = (date?: Date) => {
  if (date && !util.types.isDate(date)) {
    throw new Error('invalid date');
  }
  return Math.ceil((date || new Date()).getTime() / 1000);
};
