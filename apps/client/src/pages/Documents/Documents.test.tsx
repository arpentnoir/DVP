import { render } from '@dvp/vc-ui';
import { fireEvent, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { useQueryApi } from '../../hooks';
import { getVerifiableCredentials } from '../../services';
import { Documents, errorMessage } from './Documents';

jest.mock('../../hooks/useQueryApi/useQueryApi', () => {
  return {
    useQueryApi: jest.fn(() => ({
      handleSearch: () => null,
      handleSort: () => null,
      paginationControls: {},
      state: { rows: [] },
    })),
  };
});

describe('Documents', () => {
  it('should render correctly', () => {
    const { baseElement } = render(<Documents />);

    expect(baseElement).toMatchSnapshot();
  });

  it('should pass the error message specified in the documents component into the useQueryApi hook', () => {
    render(<Documents />);

    expect(useQueryApi as jest.Mock).toBeCalledWith(getVerifiableCredentials, {
      errorMessage,
    });
  });

  it('should navigate to the issue page when table action button is clicked', async () => {
    const history = createMemoryHistory();

    const { getByTestId } = render(<Documents />, { navigator: history });

    await waitFor(() => {
      expect(history.location.pathname).not.toBe('/issue');
    });

    fireEvent.click(getByTestId('button:Issue'));

    await waitFor(() => {
      expect(history.location.pathname).toBe('/issue');
    });
  });
});
