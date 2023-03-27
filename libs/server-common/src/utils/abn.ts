const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

/**
 *
 * @param rawAbn Validates the ABN format based on https://abr.business.gov.au/Help/AbnFormat
 *
 * The 11 digit ABN is structured as a 9 digit identifier with two leading check digits. The leading check digits are derived using a modulus 89 (remainder after dividing by 89) calculation.
 *
 * To verify an ABN:
 *  1. Subtract 1 from the first (left-most) digit of the ABN to give a new 11 digit number
 *  2. Multiply each of the digits in this new number by a "weighting factor" based on its position as shown in the table below
 *  3. Sum the resulting 11 products
 *  4. Divide the sum total by 89, noting the remainder
 *  5. If the remainder is zero the number is a valid ABN
 *
 * For example, to check if 51 824 753 556 is a valid ABN:
 *
 *  1. Subtract 1 from the first (left-most) digit (5) to give 41 824 753 556
 *  2. Multiply each of the digits in 41 824 753 556 by the "weighting factor" based on its position as shown in the table below
 *  3. Sum (Digit * weight) to give a total of 534
 *  4. Divide 534 by 89 giving 6 with zero remainder.
 *  5. As the remainder is zero, 51 824 753 556 is a valid ABN.

 * @returns boolean
 */
export function isValidABN(rawAbn: string | number): boolean {
  if (!rawAbn) {
    return false;
  }

  // strip non-alphanumeric characters
  const abn = rawAbn.toString().replace(/[^a-z\d]/gi, '');

  // check if length is 11 digits
  if (abn.length !== 11) {
    return false;
  }

  // apply ato check method
  let sum = 0;
  weights.forEach((weight, position) => {
    const digit = Number(abn[position]) - (position ? 0 : 1);
    sum += weight * digit;
  });

  const checksum = sum % 89;

  return checksum === 0;
}
