export const validChecks = [
  {
    type: 'INTEGRITY',
    text: 'Document has not been tampered with',
    valid: true,
  },
  {
    type: 'STATUS',
    text: 'Document has not been revoked',
    valid: true,
  },
  {
    type: 'ISSUER',
    text: 'Document issuer has been identified',
    valid: true,
  },
];

export const validResults = {
  issuer: 'demo.tradetrust.io',
  errors: [],
  warnings: [],
  checks: validChecks,
};

export const invalidResults = {
  errors: ['INTEGRITY'],
  warnings: [],
  checks: [],
};
