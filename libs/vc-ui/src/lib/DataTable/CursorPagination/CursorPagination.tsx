/**
* @module CursorPagination
* @description This module exports the CursorPagination component which renders
  pagination controls for navigating through paginated data using a cursor-based
  pagination system.
*/
import {
  IconButtonProps,
  TablePagination,
  TablePaginationProps,
} from '@mui/material';
import { useEffect, useState } from 'react';

/**
 * @typedef PaginationControls
 * @type {object}
 * @property {function} handleNextPage - Function to handle navigating to the next page.
 * @property {function} handlePrevPage - Function to handle navigating to the previous page.
 * @property {string|null} nextCursor - The cursor value for the next page.
 * @property {string|null} prevCursor - The cursor value for the previous page.
 * @property {number} limit - The number of items per page.
 */
export interface PaginationControls {
  handleNextPage: () => void;
  handlePrevPage: () => void;
  nextCursor: string | null;
  prevCursor: string | null;
  limit: number;
}

/**
 * @typedef ButtonProps
 * @extends IconButtonProps
 * @type {object}
 * @property {string} data-testid - The value for the data-testid attribute.
 */
interface ButtonProps extends IconButtonProps {
  'data-testid': string;
}

export const prevPageTestId = 'button:cursor-pagination-prev';
export const nextPageTestId = 'button:cursor-pagination-next';

/**
* @function CursorPagination
* @description A functional React component that renders pagination controls for navigating
  through paginated data using a cursor-based pagination system.
* @param {PaginationControls & TablePaginationProps} props - The props to configure the
  CursorPagination component.
* @returns {JSX.Element} The rendered CursorPagination component.
*/
export const CursorPagination = ({
  handleNextPage,
  handlePrevPage,
  nextCursor,
  prevCursor,
}: PaginationControls & TablePaginationProps) => {
  const [paginationData, setPaginationData] = useState({
    page: 0,
    count: 1,
    rowsPerPage: 1,
  });

  useEffect(() => {
    if (prevCursor && nextCursor)
      setPaginationData({ page: 1, count: 3, rowsPerPage: 1 });
    else if (!prevCursor && nextCursor)
      setPaginationData({ page: 0, count: 2, rowsPerPage: 1 });
    else if (prevCursor && !nextCursor)
      setPaginationData({ page: 1, count: 2, rowsPerPage: 1 });
    else setPaginationData({ page: 0, count: 1, rowsPerPage: 1 });
  }, [nextCursor, prevCursor]);

  return (
    <TablePagination
      {...paginationData}
      backIconButtonProps={
        {
          onClick: handlePrevPage,
          'data-testid': prevPageTestId,
        } as ButtonProps
      }
      nextIconButtonProps={
        {
          onClick: handleNextPage,
          'data-testid': nextPageTestId,
        } as ButtonProps
      }
      sx={{
        '.MuiTablePagination-displayedRows': { display: 'none' },
      }}
      SelectProps={{ sx: { display: 'none' } }}
      component={'div'}
      // Arbitrary values set to suppress warnings
      rowsPerPageOptions={[{ value: 50, label: '' }]}
      onPageChange={() => {
        return;
      }}
    />
  );
};
