/**
* @module DataTable
* @description This module exports the DataTable component which renders
  a data table with a custom toolbar, pagination, and error handling.
*/
import { Box, BoxProps } from '@mui/material';
import { DataGrid, DataGridProps, GridSortModel } from '@mui/x-data-grid';
import { useCallback } from 'react';
import {
  CursorPagination,
  PaginationControls,
} from './CursorPagination/CursorPagination';
import { ErrorOverlay } from './ErrorOverlay';
import { Toolbar } from './Toolbar';

declare module '@mui/x-data-grid' {
  interface NoRowsOverlayPropsOverrides {
    errorMessage: string;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface PaginationPropsOverrides extends PaginationControls {}
}

type HandleSearch = (searchString: string) => Promise<void>;
type HandleSort = (sort: 'asc' | 'desc') => Promise<void>;

/**
 * @typedef IDataTable
 * @type {object}
 * @property {function} [handleAction] - The function to handle the toolbar button click action.
 * @property {string} [toolBarActionLabel] - The label for the toolbar action button.
 * @property {HandleSearch} [handleOnSearch] - The function to handle the toolbar search events.
 * @property {number} [minSearchQueryLength] - The minimum search query length before triggering a search.
 * @property {PaginationControls} [paginationControls] - The pagination controls for the data table.
 * @property {HandleSort} [handleOnSort] - The function to handle sorting events.
 * @property {boolean} [isLoading] - A flag indicating if the data is currently being fetched.
 * @property {string|null} [error] - An error message to be displayed, if any.
 * @property {BoxProps} [containerProps] - Props to be passed to the container Box component.
 */
interface IDataTable extends DataGridProps {
  handleAction?: () => void;
  toolBarActionLabel?: string;
  handleOnSearch?: HandleSearch;
  minSearchQueryLength?: number;
  paginationControls?: PaginationControls;
  handleOnSort?: HandleSort;
  isLoading?: boolean;
  error?: string | null;
  containerProps?: BoxProps;
}

/**
* @function DataTable
* @description A functional React component that renders a data table with
  a custom toolbar, pagination, and error handling.
* @param {IDataTable} props - The props to configure the DataTable component.
* @returns {JSX.Element} The rendered DataTable component.
*/
export const DataTable = ({
  handleAction,
  toolBarActionLabel,
  handleOnSearch,
  minSearchQueryLength,
  paginationControls,
  handleOnSort,
  isLoading,
  rows,
  error,
  containerProps,
  ...rest
}: IDataTable) => {
  const handleSort = useCallback(
    async (model: GridSortModel) => {
      if (handleOnSort && model?.length > 0) {
        const sort = model[0]?.sort ?? 'asc';
        await handleOnSort(sort);
      }
    },
    [handleOnSort]
  );

  return (
    <Box style={{ height: 600, width: '100%' }} {...containerProps}>
      <DataGrid
        slots={{
          // TODO: Swap loading overlay once built
          toolbar: Toolbar,
          pagination: CursorPagination,
          ...(error ? { noRowsOverlay: ErrorOverlay } : {}),
        }}
        slotProps={{
          toolbar: {
            handleAction,
            label: toolBarActionLabel,
            handleOnSearch,
            minSearchQueryLength,
          },
          pagination: paginationControls,
          ...(error ? { noRowsOverlay: { errorMessage: error } } : {}),
        }}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSortModelChange={handleSort}
        sortingOrder={['asc', 'desc']}
        // TODO: Remove conditional and set to server when other pages are hooked up to the API
        sortingMode={handleOnSort ? 'server' : 'client'}
        rows={error ? [] : rows}
        loading={isLoading}
        {...rest}
      />
    </Box>
  );
};
