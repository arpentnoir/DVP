import { findByText, render } from '@testing-library/react';
import { FooBar } from './FooBar';

describe('FooBar', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<FooBar message="Welcome to VC-UI!" />);
    expect(baseElement).toBeTruthy();
    await findByText(baseElement, 'Welcome to VC-UI!');
  });
});
