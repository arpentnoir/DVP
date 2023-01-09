import { render } from '@testing-library/react';
import { NotFoundError } from './NotFoundError';

describe('NotFoundError', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<NotFoundError />);

    expect(baseElement).toMatchSnapshot();
  });
});
