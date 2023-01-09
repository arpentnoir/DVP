import { render } from '@testing-library/react';
import { AppError } from './AppError';

describe('AppError', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<AppError />);

    expect(baseElement).toMatchSnapshot();
  });
});
