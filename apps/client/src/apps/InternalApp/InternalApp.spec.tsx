import { render } from '@testing-library/react';
import { InternalApp } from './InternalApp';

describe('InternalApp', () => {
  it('should render successfully', () => {
    render(<InternalApp />);
  });
});
