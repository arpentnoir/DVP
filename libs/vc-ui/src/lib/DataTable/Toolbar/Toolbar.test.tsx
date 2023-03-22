import { DataGrid } from '@mui/x-data-grid';
import { fireEvent, render, waitFor } from '@testing-library/react';
import lodash from 'lodash';
import { DEFAULT_DEBOUNCE_TIME } from '../../constants';
import { columns, rows } from '../../fixtures/tableData';
import { clearSearchButtonTestId, Toolbar } from './Toolbar';

let mockDebounce: jest.SpyInstance;

const mockHandleAction = jest.fn();
const mockOnSearch = jest.fn();
const actionLabel = 'Issue';

const props = {
  label: actionLabel,
  handleAction: mockHandleAction,
  handleOnSearch: mockOnSearch,
  searchDebounceTime: 0,
};

const tableProps = {
  rows,
  columns,
};

describe('ToolbarComponent', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    mockDebounce = jest.spyOn(lodash, 'debounce');
  });
  it('should render correctly', () => {
    const { baseElement } = render(
      <DataGrid
        {...tableProps}
        slots={{ toolbar: Toolbar }}
        slotProps={{ toolbar: props }}
      />
    );

    expect(baseElement).toMatchSnapshot();
  });

  describe('ToolbarAction', () => {
    it('should display the action label when provided', () => {
      const { getByTestId } = render(
        <DataGrid
          {...tableProps}
          slots={{ toolbar: Toolbar }}
          slotProps={{ toolbar: props }}
        />
      );

      expect(getByTestId(`button:${actionLabel}`).textContent).toBe(
        actionLabel
      );
    });

    it('should call the handle action button when action button is clicked', async () => {
      const { getByTestId } = render(
        <DataGrid
          {...tableProps}
          slots={{ toolbar: Toolbar }}
          slotProps={{ toolbar: props }}
        />
      );

      const actionButton = getByTestId(`button:${actionLabel}`);

      fireEvent.click(actionButton);

      await waitFor(() => {
        expect(mockHandleAction).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('ToolbarSearch', () => {
    it('should use the default search component when handleOnSearch is not provided and display the relevant results from search', async () => {
      const { getByPlaceholderText, queryByText } = render(
        <DataGrid
          {...tableProps}
          slots={{ toolbar: Toolbar }}
          slotProps={{ toolbar: { ...props, handleOnSearch: undefined } }}
        />
      );

      expect(queryByText('007')).toBeTruthy();
      expect(queryByText('Wreck-It')).toBeTruthy();
      expect(queryByText('Ralph')).toBeTruthy();

      const searchBar = getByPlaceholderText('Search…');

      fireEvent.change(searchBar, { target: { value: '006' } });

      await waitFor(() => {
        expect(mockOnSearch).not.toHaveBeenCalled();
        expect(queryByText('007')).toBeFalsy();
        expect(queryByText('Wreck-It')).toBeFalsy();
        expect(queryByText('Ralph')).toBeFalsy();
      });
    });

    it('should use the custom search component when handleOnSearch is provided and call handleOnSearch on search', async () => {
      const { getByPlaceholderText, queryByTestId } = render(
        <DataGrid
          {...tableProps}
          slots={{ toolbar: Toolbar }}
          slotProps={{ toolbar: props }}
        />
      );

      expect(mockOnSearch).not.toHaveBeenCalled();
      expect(queryByTestId(clearSearchButtonTestId)).not.toBeInTheDocument();

      const searchBar = getByPlaceholderText('Search…');

      fireEvent.change(searchBar, { target: { value: 'test search' } });

      await waitFor(() => {
        expect(mockDebounce.mock.calls[0][1]).toBe(props.searchDebounceTime);
        expect(mockOnSearch).toHaveBeenCalledTimes(1);
        expect(mockOnSearch).toHaveBeenCalledWith('test search');
        expect(queryByTestId(clearSearchButtonTestId)).toBeInTheDocument();
      });
    });

    it('should use the default debounce time', async () => {
      const { getByPlaceholderText, queryByTestId } = render(
        <DataGrid
          {...tableProps}
          slots={{ toolbar: Toolbar }}
          slotProps={{ toolbar: { ...props, searchDebounceTime: undefined } }}
        />
      );

      expect(mockOnSearch).not.toHaveBeenCalled();
      expect(queryByTestId(clearSearchButtonTestId)).not.toBeInTheDocument();

      const searchBar = getByPlaceholderText('Search…');

      fireEvent.change(searchBar, { target: { value: 'test search' } });

      await waitFor(() => {
        expect(mockDebounce.mock.calls[0][1]).toBe(DEFAULT_DEBOUNCE_TIME);
        expect(mockOnSearch).toHaveBeenCalledTimes(1);
        expect(mockOnSearch).toHaveBeenCalledWith('test search');
        expect(queryByTestId(clearSearchButtonTestId)).toBeInTheDocument();
      });
    });

    it('should use the default minSearchQueryLimit on search', async () => {
      const { getByPlaceholderText, queryByTestId } = render(
        <DataGrid
          {...tableProps}
          slots={{ toolbar: Toolbar }}
          slotProps={{ toolbar: props }}
        />
      );
      expect(mockOnSearch).not.toHaveBeenCalled();
      expect(queryByTestId(clearSearchButtonTestId)).not.toBeInTheDocument();

      const searchBar = getByPlaceholderText('Search…');

      fireEvent.change(searchBar, { target: { value: '123' } });

      await waitFor(() => {
        expect(mockOnSearch).not.toHaveBeenCalled();
        expect(queryByTestId(clearSearchButtonTestId)).toBeInTheDocument();
      });

      fireEvent.change(searchBar, { target: { value: '1234' } });

      await waitFor(() => {
        expect(mockDebounce.mock.calls[0][1]).toBe(props.searchDebounceTime);
        expect(mockOnSearch).toHaveBeenCalledTimes(1);
        expect(mockOnSearch).toHaveBeenCalledWith('1234');
        expect(queryByTestId(clearSearchButtonTestId)).toBeInTheDocument();
      });

      fireEvent.change(searchBar, { target: { value: '12345' } });

      await waitFor(() => {
        expect(mockDebounce.mock.calls[1][1]).toBe(props.searchDebounceTime);
        expect(mockOnSearch).toHaveBeenCalledTimes(2);
        expect(mockOnSearch).toHaveBeenCalledWith('12345');
        expect(queryByTestId(clearSearchButtonTestId)).toBeInTheDocument();
      });
    });

    it('should use the provided minSearchQueryLimit on search', async () => {
      const { getByPlaceholderText, queryByTestId } = render(
        <DataGrid
          {...tableProps}
          slots={{ toolbar: Toolbar }}
          slotProps={{ toolbar: props }}
        />
      );

      expect(mockOnSearch).not.toHaveBeenCalled();
      expect(queryByTestId(clearSearchButtonTestId)).not.toBeInTheDocument();

      const searchBar = getByPlaceholderText('Search…');

      fireEvent.change(searchBar, { target: { value: '123456' } });

      await waitFor(() => {
        expect(mockOnSearch).not.toHaveBeenCalled();
        expect(queryByTestId(clearSearchButtonTestId)).toBeInTheDocument();
      });

      fireEvent.change(searchBar, { target: { value: '1234567' } });

      await waitFor(() => {
        expect(mockDebounce.mock.calls[0][1]).toBe(props.searchDebounceTime);
        expect(mockOnSearch).toHaveBeenCalledTimes(1);
        expect(mockOnSearch).toHaveBeenCalledWith('1234567');
        expect(queryByTestId(clearSearchButtonTestId)).toBeInTheDocument();
      });

      fireEvent.change(searchBar, { target: { value: '12345678' } });

      await waitFor(() => {
        expect(mockDebounce.mock.calls[1][1]).toBe(props.searchDebounceTime);
        expect(mockOnSearch).toHaveBeenCalledTimes(2);
        expect(mockOnSearch).toHaveBeenCalledWith('12345678');
        expect(queryByTestId(clearSearchButtonTestId)).toBeInTheDocument();
      });
    });

    it('should clear the text input when clear text button is clicked', async () => {
      const { getByPlaceholderText, getByTestId, queryByTestId } = render(
        <DataGrid
          {...tableProps}
          slots={{ toolbar: Toolbar }}
          slotProps={{ toolbar: props }}
        />
      );

      expect(mockOnSearch).not.toHaveBeenCalled();
      expect(queryByTestId(clearSearchButtonTestId)).not.toBeInTheDocument();

      const searchBar = getByPlaceholderText('Search…');

      fireEvent.change(searchBar, { target: { value: '1234' } });

      await waitFor(() => {
        expect(mockDebounce.mock.calls[0][1]).toBe(props.searchDebounceTime);
        expect(mockOnSearch).toHaveBeenCalledTimes(1);
      });

      fireEvent.click(getByTestId(clearSearchButtonTestId));

      await waitFor(() => {
        expect(mockDebounce.mock.calls[1][1]).toBe(props.searchDebounceTime);
        expect(mockOnSearch).toHaveBeenCalledTimes(2);
        expect(searchBar.textContent).toBe('');
      });
    });
  });
});
