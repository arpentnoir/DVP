import {
  getByAltText,
  getByText,
  render,
  waitFor,
} from '@testing-library/react';
import { NavBar } from './NavBar';

describe('NavBar', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<NavBar />);
    await waitFor(() => {
      getByAltText(baseElement, 'Australian Border Force Logo');
      getByText(baseElement, 'Digital Verification Platform');
    });
  });
});
