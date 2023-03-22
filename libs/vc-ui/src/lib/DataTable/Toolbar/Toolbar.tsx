/**
* @module Toolbar
* @description This module exports the Toolbar component which renders a
custom toolbar with search functionality and an action button.
*/
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton, InputAdornment, Stack } from '@mui/material';
import { GridToolbarQuickFilter } from '@mui/x-data-grid';
import { debounce } from 'lodash';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../../Button';
import {
  DEFAULT_DEBOUNCE_TIME,
  DEFAULT_SEARCH_QUERY_LENGTH,
} from '../../constants';

/**
 * @typedef IToolbar
 * @type {object}
 * @property {string} label - The label for the action button.
 * @property {function} handleAction - The function to be called when the action button is clicked.
 * @property {function} [handleOnSearch] - The function to handle the search event.
 * @property {number} [minSearchQueryLength] - The minimum length of the search query before triggering a API query.
 * @property {number} [searchDebounceTime] - The debounce time for the search event.
 */
interface IToolbar {
  label: string;
  handleAction: () => void;
  handleOnSearch?: (query?: string) => Promise<void>;
  minSearchQueryLength?: number;
  searchDebounceTime?: number;
}

export const clearSearchButtonTestId = 'button:clear-table-search-field';

/**
* @function Toolbar
* @description A functional React component that renders a custom toolbar with
  search functionality and an action button.
* @param {IToolbar} props - The props to configure the Toolbar component.
* @returns {JSX.Element} The rendered Toolbar component.
*/
export const Toolbar = ({
  label,
  handleAction,
  handleOnSearch,
  minSearchQueryLength = DEFAULT_SEARCH_QUERY_LENGTH,
  searchDebounceTime = DEFAULT_DEBOUNCE_TIME,
}: IToolbar) => {
  const [query, setQuery] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (handleOnSearch) {
        await handleOnSearch(query);
      }
    }, searchDebounceTime),
    [handleOnSearch]
  );

  useEffect(() => {
    if (query === '') {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handleSearch(query);
    }
    if (query && query.length > minSearchQueryLength) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handleSearch(query);
    }
  }, [query]);

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleOnButtonClick = () => {
    setQuery('');
    // TODO: Ref not being passed to input
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  };
  return (
    <Stack
      padding="16px"
      direction={{ xs: 'column', sm: 'row' }}
      spacing="16px"
      justifyContent="space-between"
    >
      {/* TODO: Remove conditional when other pages are hooked up to the API */}
      {handleOnSearch ? (
        <GridToolbarQuickFilter
          value={query ?? ''}
          onChange={handleOnChange}
          InputProps={{
            inputRef: inputRef,
            endAdornment: (
              <InputAdornment position="end">
                {query && (
                  <IconButton
                    data-testid={clearSearchButtonTestId}
                    aria-label="Clear table search field"
                    onClick={handleOnButtonClick}
                    edge="end"
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      ) : (
        <GridToolbarQuickFilter />
      )}

      {label && handleAction && (
        <Button
          color="error"
          label={label}
          leftIcon={<AddIcon />}
          onClick={handleAction}
          style={{ marginLeft: 'auto' }}
        />
      )}
    </Stack>
  );
};
