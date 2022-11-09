import { render } from '@testing-library/react';
import { VerifyViewer } from './VerifyViewer';
import { CHAFTA_COO, validResults } from '../fixtures';

describe('VerifyViewer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <VerifyViewer document={CHAFTA_COO} results={validResults} />
    );
    expect(baseElement).toBeTruthy();
  });
});
