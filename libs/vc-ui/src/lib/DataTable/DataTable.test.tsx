import { GridColDef } from '@mui/x-data-grid';
import { fireEvent, render, waitFor } from '@testing-library/react';
import {
  nextPageTestId,
  prevPageTestId,
} from './CursorPagination/CursorPagination';
import { DataTable } from './DataTable';
import { errorMessageTestId } from './ErrorOverlay';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
  },
  {
    field: 'firstName',
    headerName: 'First Name',
  },
  {
    field: 'lastName',
    headerName: 'Last Name',
  },
];

const rows = [
  {
    id: '006',
    firstName: 'Postman',
    lastName: 'Pat',
  },
  {
    id: '007',
    firstName: 'Wreck-It',
    lastName: 'Ralph',
  },
];

const mockHandleAction = jest.fn();
const mockOnSearch = jest.fn();
const actionLabel = 'Issue';

const mockHandleNextPage = jest.fn();
const mockHandlePrevPage = jest.fn();

const mockHandleSort = jest.fn();

const mockPaginationControls = {
  handleNextPage: mockHandleNextPage,
  handlePrevPage: mockHandlePrevPage,
  nextCursor: null,
  prevCursor: null,
  limit: 50,
};

describe('DataTable', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const { baseElement } = render(
      <DataTable
        columns={columns}
        rows={rows}
        handleOnSort={mockHandleSort}
        handleOnSearch={mockOnSearch}
        toolBarActionLabel={actionLabel}
        handleAction={mockHandleAction}
        paginationControls={mockPaginationControls}
      />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should display all fields and their values', () => {
    const { getByText } = render(
      <DataTable
        columns={columns}
        rows={rows}
        handleOnSort={mockHandleSort}
        handleOnSearch={mockOnSearch}
        toolBarActionLabel={actionLabel}
        handleAction={mockHandleAction}
        paginationControls={mockPaginationControls}
      />
    );

    getByText('006');
    getByText('Postman');
    getByText('Pat');

    getByText('007');
    getByText('Wreck-It');
    getByText('Ralph');
  });

  describe('ToolbarComponent', () => {
    it('should use the handleOnSearch function on search', async () => {
      const { getByPlaceholderText } = render(
        <DataTable
          columns={columns}
          rows={rows}
          handleOnSort={mockHandleSort}
          handleOnSearch={mockOnSearch}
          toolBarActionLabel={actionLabel}
          handleAction={mockHandleAction}
          paginationControls={{
            ...mockPaginationControls,
            nextCursor: 'next',
            prevCursor: 'prev',
          }}
        />
      );

      expect(mockOnSearch).not.toHaveBeenCalled();

      const searchBar = getByPlaceholderText('Search…');

      fireEvent.change(searchBar, { target: { value: '1234' } });

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledTimes(1);
        expect(mockOnSearch).toHaveBeenCalledWith('1234');
      });
    });
  });

  describe('PaginationComponent', () => {
    it('should call the handleNextPage/handlePrevPage when their respective button is clicked', () => {
      const { getByTestId } = render(
        <DataTable
          columns={columns}
          rows={rows}
          handleOnSort={mockHandleSort}
          handleOnSearch={mockOnSearch}
          toolBarActionLabel={actionLabel}
          handleAction={mockHandleAction}
          paginationControls={{
            ...mockPaginationControls,
            nextCursor: 'next',
            prevCursor: 'prev',
          }}
        />
      );

      const prevPageIcon = getByTestId(prevPageTestId);
      const nextPageIcon = getByTestId(nextPageTestId);

      fireEvent.click(prevPageIcon);
      expect(mockHandlePrevPage).toBeCalledTimes(1);

      fireEvent.click(nextPageIcon);
      expect(mockHandleNextPage).toBeCalledTimes(1);
    });
  });

  describe('ErrorOverlayComponent', () => {
    it('should display error overlay when error is passed in', () => {
      const errorMessage = 'Test error message';

      const { queryByText, getByTestId } = render(
        <DataTable
          columns={columns}
          rows={rows}
          error={errorMessage}
          handleOnSort={mockHandleSort}
          handleOnSearch={mockOnSearch}
          toolBarActionLabel={actionLabel}
          handleAction={mockHandleAction}
          paginationControls={mockPaginationControls}
        />
      );

      expect(getByTestId(errorMessageTestId).textContent).toBe(errorMessage);
      expect(getByTestId(errorMessageTestId)).toHaveFocus();

      expect(queryByText('006')).toBeFalsy();
      expect(queryByText('Postman')).toBeFalsy();
      expect(queryByText('Pat')).toBeFalsy();

      expect(queryByText('007')).toBeFalsy();
      expect(queryByText('Wreck-It')).toBeFalsy();
      expect(queryByText('Ralph')).toBeFalsy();
    });
  });

  describe('SortingComponent', () => {
    it('should call the handleOnSort function provided when sorting', async () => {
      const { getByText } = render(
        <DataTable
          columns={columns}
          rows={rows}
          handleOnSort={mockHandleSort}
          handleOnSearch={mockOnSearch}
          toolBarActionLabel={actionLabel}
          handleAction={mockHandleAction}
          paginationControls={mockPaginationControls}
        />
      );

      const firstHeaderSlot = getByText('ID');

      // Order doesn't change on first click
      fireEvent.click(firstHeaderSlot);

      await waitFor(() => {
        expect(mockHandleSort).toBeCalledWith('asc');
        expect(mockHandleSort).toBeCalledTimes(1);
      });

      fireEvent.click(firstHeaderSlot);

      await waitFor(() => {
        expect(mockHandleSort).toBeCalledWith('desc');
        expect(mockHandleSort).toBeCalledTimes(2);
      });
    });
  });
});
