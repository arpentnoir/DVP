import { TablePaginationProps } from '@mui/material';
import { fireEvent, render } from '@testing-library/react';
import {
  CursorPagination,
  nextPageTestId,
  PaginationControls,
  prevPageTestId,
} from './CursorPagination';

const mockHandleNextPage = jest.fn();
const mockHandlePrevPage = jest.fn();
const mockNextCursor = null;
const mockPrevCursor = null;
const limit = 50;

const mockedCursorPaginationProps = {
  handleNextPage: mockHandleNextPage,
  handlePrevPage: mockHandlePrevPage,
  nextCursor: mockNextCursor,
  prevCursor: mockPrevCursor,
  limit,
} as unknown as PaginationControls & TablePaginationProps;

describe('CursorPagination', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    const { baseElement } = render(
      <CursorPagination {...mockedCursorPaginationProps} />
    );

    expect(baseElement).toMatchSnapshot();
  });

  it('should disable both buttons if next/prev cursor are null', () => {
    const { getByTestId } = render(
      <CursorPagination {...mockedCursorPaginationProps} />
    );

    expect(getByTestId(prevPageTestId)).toHaveAttribute('disabled');
    expect(getByTestId(nextPageTestId)).toHaveAttribute('disabled');
  });

  it('should enable next button and disable prev button', () => {
    const { getByTestId } = render(
      <CursorPagination
        {...mockedCursorPaginationProps}
        nextCursor={'nextCursor'}
      />
    );

    expect(getByTestId(prevPageTestId)).toHaveAttribute('disabled');
    expect(getByTestId(nextPageTestId)).not.toHaveAttribute('disabled');
  });

  it('should enable prev button and disable next button', () => {
    const { getByTestId } = render(
      <CursorPagination
        {...mockedCursorPaginationProps}
        prevCursor={'prevCursor'}
      />
    );

    expect(getByTestId(prevPageTestId)).not.toHaveAttribute('disabled');
    expect(getByTestId(nextPageTestId)).toHaveAttribute('disabled');
  });

  it('should enable next/prev button', () => {
    const { getByTestId } = render(
      <CursorPagination
        {...mockedCursorPaginationProps}
        nextCursor={'nextCursor'}
        prevCursor={'prevCursor'}
      />
    );

    expect(getByTestId(prevPageTestId)).not.toHaveAttribute('disabled');
    expect(getByTestId(nextPageTestId)).not.toHaveAttribute('disabled');
  });

  it('should call the handleNextPage function when next button is clicked', () => {
    const { getByTestId } = render(
      <CursorPagination
        {...mockedCursorPaginationProps}
        nextCursor={'nextCursor'}
      />
    );

    const nextPageButton = getByTestId(nextPageTestId);
    fireEvent.click(nextPageButton);

    expect(mockHandleNextPage).toHaveBeenCalledTimes(1);
    expect(mockHandlePrevPage).not.toHaveBeenCalled();
  });

  it('should call the handlePrevPage function when prev button is clicked', () => {
    const { getByTestId } = render(
      <CursorPagination
        {...mockedCursorPaginationProps}
        prevCursor={'prevCursor'}
      />
    );

    const prevPageButton = getByTestId(prevPageTestId);
    fireEvent.click(prevPageButton);

    expect(mockHandlePrevPage).toHaveBeenCalledTimes(1);
    expect(mockHandleNextPage).not.toHaveBeenCalled();
  });
});
