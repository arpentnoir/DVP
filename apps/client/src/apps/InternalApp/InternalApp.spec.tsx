import { render } from '@testing-library/react';
import { InternalApp } from './InternalApp';

jest.mock('./BaseApp', () => {
  const BaseApp = () => <div />;
  return { BaseApp };
});

describe('InternalApp', () => {
  it('should render successfully', () => {
    render(<InternalApp />);
  });
});
