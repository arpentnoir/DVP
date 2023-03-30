/**
* @module useQueryApi
* @description This module exports the useQueryApi custom hook, which
  provides a convenient way to manage API queries, pagination, and sorting.
*/

import { Pagination } from '@dvp/api-interfaces';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_API_QUERY_ERROR_MESSAGE,
  DEFAULT_TABLE_LIMIT,
} from '../../constants';

/**
 * @typedef Sort
 * @type {'asc' | 'desc'}
 * @description Represents the sorting order.
 */
type Sort = 'asc' | 'desc';

/**
 * @typedef State
 * @type {object}
 * @template T
 * @property {string} searchString - The search string to be used in the query.
 * @property {T[]|null} data - The fetched data or null if not yet fetched.
 * @property {Pagination} pagination - The pagination information.
 * @property {boolean} isLoading - A flag indicating if the data is being fetched.
 * @property {string|null} errorMessage - An error message if an error occurred, otherwise null.
 * @property {Sort} sort - The sort order ('asc' or 'desc').
 */
interface State<T> {
  searchString: string;
  data: null | T[];
  pagination: Pagination;
  isLoading: boolean;
  errorMessage: string | null;
  sort: Sort;
}

/**
 * @typedef QueryFunctionResponse
 * @type {object}
 * @template T
 * @property {T[]} results - The results of the query.
 * @property {Pagination} [pagination] - The pagination information for the results.
 */
interface QueryFunctionResponse<T> {
  results: T[];
  pagination?: Pagination;
}

/**
 * @typedef QueryFunctionOptions
 * @type {object}
 * @property {object} pagination - The pagination options.
 * @property {string|null} [pagination.nextCursor] - The cursor for the next page, if available.
 * @property {string|null} [pagination.prevCursor] - The cursor for the previous page, if available.
 * @property {number} pagination.limit - The number of items per page.
 * @property {Sort} sort - The sort order ('asc' or 'desc').
 */
export interface QueryFunctionOptions {
  pagination: {
    nextCursor?: string | null;
    prevCursor?: string | null;
    limit: number;
  };
  sort: Sort;
}

/**
 * @callback QueryFunction
 * @template T
 * @param {string} searchString - The search string to be used in the query.
 * @param {QueryFunctionOptions} options - The options for the query.
 * @returns {Promise<QueryFunctionResponse<T>>} A promise resolving with the query results.
 */
export type QueryFunction<T> = (
  searchString: string,
  options: QueryFunctionOptions
) => Promise<QueryFunctionResponse<T>>;

/**
 * @typedef PaginationControls
 * @type {object}
 * @extends Pagination
 * @property {function} handleNextPage - A function to fetch the next page.
 * @property {function} handlePrevPage - A function to fetch the previous page.
 */
export interface PaginationControls extends Pagination {
  handleNextPage: () => Promise<void>;
  handlePrevPage: () => Promise<void>;
}

/**
* @function useQueryApi
* @description A custom React hook for managing API queries, pagination, and sorting.
* @template T
* @param {QueryFunction<T>} queryFunction - The function to fetch data from the API.
* @param {object} [options] - Optional settings for the hook.
* @param {string} [options.errorMessage] - The custom error message to be displayed when an error occurs.
* @param {number} [options.defaultLimit] - The default number of items per page.
* @returns {object} An object containing functions to fetch the data, handle search, sort, and pagination,
  as well as the current state of the hook.
*/
export function useQueryApi<T>(
  queryFunction: QueryFunction<T>,
  options?: {
    errorMessage?: string;
    defaultLimit?: number;
  }
) {
  const { errorMessage, defaultLimit } = options ?? {};

  const [state, setState] = useState<State<T>>({
    data: null,
    pagination: {
      nextCursor: null,
      prevCursor: null,
      limit: defaultLimit ?? DEFAULT_TABLE_LIMIT,
    },
    searchString: '',
    isLoading: false,
    errorMessage: '',
    sort: 'asc',
  });

  useEffect(() => {
    if (!state.data) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      queryApi(state.searchString);
    }
  }, []);

  const queryApi = async (
    searchString: string,
    options?: {
      pagination?: {
        nextCursor?: string | null;
        prevCursor?: string | null;
        limit?: number;
      };
      sort?: Sort;
    }
  ) => {
    try {
      setState((previous) => ({ ...previous, isLoading: true }));

      const { results, pagination } = await queryFunction(searchString, {
        pagination: {
          ...(options?.pagination ?? {}),
          limit: state.pagination.limit,
        },
        sort: options?.sort ?? state.sort,
      });

      setState((previous) => {
        return {
          ...previous,
          isLoading: false,
          data: results,
          pagination: pagination ?? {
            ...previous.pagination,
            nextCursor: null,
            prevCursor: null,
          },
          sort: options?.sort ?? previous.sort,
          searchString: searchString ?? previous.searchString,
        };
      });
    } catch {
      return setState((previous) => ({
        ...previous,
        isLoading: false,
        pagination: {
          ...previous.pagination,
          nextCursor: null,
          prevCursor: null,
        },
        sort: options?.sort ?? previous.sort,
        errorMessage: errorMessage ?? DEFAULT_API_QUERY_ERROR_MESSAGE,
        searchString: searchString ?? previous.searchString,
      }));
    }
  };

  const fetch = useCallback(async () => {
    await queryApi(state.searchString, { sort: state.sort });
  }, [queryApi, state.searchString, state.sort]);

  const handleSearch = useCallback(
    async (searchString: string) => {
      await queryApi(searchString);
    },
    [queryApi]
  );

  const handleSort = useCallback(
    async (sort: Sort) => {
      await queryApi(state.searchString, { sort });
    },
    [queryApi, state.searchString]
  );

  const handleNextPage = useCallback(async () => {
    await queryApi(state.searchString, {
      pagination: {
        nextCursor: state.pagination.nextCursor,
        limit: state.pagination.limit,
      },
    });
  }, [queryApi, state.pagination, state.searchString]);

  const handlePrevPage = useCallback(async () => {
    await queryApi(state.searchString, {
      pagination: {
        prevCursor: state.pagination.prevCursor,
        limit: state.pagination.limit,
      },
    });
  }, [queryApi, state.pagination, state.searchString]);

  const paginationControls = useMemo(
    () => ({
      handleNextPage,
      handlePrevPage,
      ...state.pagination,
    }),
    [handleNextPage, handlePrevPage, state.pagination]
  );

  const setLoading = (isLoading: boolean) => {
    setState((previous) => ({ ...previous, isLoading }));
  };

  const setErrorMesssage = (errorMessage: string) => {
    setState((previous) => ({ ...previous, errorMessage }));
  };

  return {
    fetch,
    handleSearch,
    handleSort,
    paginationControls,
    state,
    setLoading,
    setErrorMesssage,
  };
}
