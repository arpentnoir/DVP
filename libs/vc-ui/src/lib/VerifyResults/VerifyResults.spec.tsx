import { getByTestId, getByText, render } from '@testing-library/react';
import { invalidResults, validResults } from '../fixtures';
import { VerifyResults } from './VerifyResults';

describe('VerifyResults', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <VerifyResults {...(validResults as any)} />
    );
    expect(baseElement).toBeTruthy();
  });

  it('should display correct checks if valid', () => {
    const { baseElement } = render(
      <VerifyResults {...(validResults as any)} />
    );

    const integrityCheck = getByTestId(baseElement, 'INTEGRITY');
    const statusCheck = getByTestId(baseElement, 'STATUS');
    const issuerCheck = getByTestId(baseElement, 'ISSUER');

    getByText(baseElement, 'Valid');
    getByText(integrityCheck, 'Document has not been tampered with');
    getByText(statusCheck, 'Document has not been revoked');
    getByText(issuerCheck, 'Document issuer has been identified');
  });

  it('should display correct error message if invalid', () => {
    const { baseElement } = render(<VerifyResults {...invalidResults} />);

    getByText(baseElement, 'Invalid');
    getByText(
      baseElement,
      "The document hasn't been verified yet, or some verification aspects are invalid or document has been tampered with"
    );
  });
});
