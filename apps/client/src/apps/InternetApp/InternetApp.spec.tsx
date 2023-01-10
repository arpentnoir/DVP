import { act, render } from '@testing-library/react';
import { InternetApp } from './index';

jest.mock('./BaseApp', () => {
  const BaseApp = () => <div />;
  return { BaseApp };
});

describe('InternetApp', () => {
  it('should render successfully', () => {
    act(() => {
      render(<InternetApp />);
    });
  });
});
