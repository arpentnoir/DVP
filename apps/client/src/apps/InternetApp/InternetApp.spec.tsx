import { render } from '@testing-library/react';
import { InternetApp } from './index';

describe('App', () => {
  it('should render successfully', () => {
    render(<InternetApp />);
  });
});
