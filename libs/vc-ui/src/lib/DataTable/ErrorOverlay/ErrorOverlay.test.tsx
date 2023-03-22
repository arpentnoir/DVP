import { render } from '@testing-library/react';
import { DEFAULT_TABLE_ERROR_MESSAGE } from '../../constants';
import { errorMessageTestId, ErrorOverlay } from './ErrorOverlay';

const mockErrorMessage = 'Test error message';
describe('ErrorOverlay', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<ErrorOverlay />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should use the default error text', () => {
    const { getByTestId } = render(<ErrorOverlay />);

    expect(getByTestId(errorMessageTestId).textContent).toBe(
      DEFAULT_TABLE_ERROR_MESSAGE
    );
  });

  it('should use the error message passed in', () => {
    const { getByTestId } = render(
      <ErrorOverlay errorMessage={mockErrorMessage} />
    );

    expect(getByTestId(errorMessageTestId).textContent).toBe(mockErrorMessage);
  });

  it('should have focus on the error message', () => {
    const { getByTestId } = render(<ErrorOverlay />);

    const errorMessage = getByTestId(errorMessageTestId);

    expect(errorMessage.textContent).toBe(DEFAULT_TABLE_ERROR_MESSAGE);
    expect(errorMessage).toHaveFocus();
  });
});
