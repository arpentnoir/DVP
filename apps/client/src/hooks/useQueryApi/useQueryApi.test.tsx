/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { act, waitFor } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import {
  DEFAULT_API_QUERY_ERROR_MESSAGE,
  DEFAULT_TABLE_LIMIT,
} from '../../constants';
import { useQueryApi } from './useQueryApi';

const mockQueryFunction = jest.fn();

const defaultLimit = 20;
const baseQueryFunctionOptions = {
  pagination: {
    limit: defaultLimit,
  },
  sort: 'asc',
};

const mockQueryResponse = {
  results: [{ test: 'result' }],
  pagination: {
    nextCursor: 'nextCursor',
    prevCursor: null,
    limit: defaultLimit,
  },
};

describe('UseQueryApi', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return the correct object', async () => {
    mockQueryFunction.mockResolvedValue(mockQueryResponse);

    const { result } = renderHook(() => useQueryApi<any>(mockQueryFunction));

    await waitFor(() => {
      expect(mockQueryFunction).toBeCalledTimes(1);
      expect(result.current.fetch).toBeDefined();
      expect(result.current.handleSearch).toBeDefined();
      expect(result.current.handleSort).toBeDefined();
      expect(result.current.paginationControls).toBeDefined();
      expect(result.current.state).toBeDefined();
    });
  });

  it('should call the query function and update the state on mount', async () => {
    mockQueryFunction.mockResolvedValue(mockQueryResponse);

    const { result } = renderHook(() =>
      useQueryApi<any>(mockQueryFunction, { defaultLimit })
    );

    await waitFor(() => {
      expect((result.all[1] as any).state.isLoading).toBe(true);
      expect(mockQueryFunction).toBeCalledTimes(1);
      expect(mockQueryFunction).toBeCalledWith('', baseQueryFunctionOptions);
      expect(result.current.state).toStrictEqual({
        data: mockQueryResponse.results,
        pagination: mockQueryResponse.pagination,
        searchString: '',
        isLoading: false,
        errorMessage: '',
        sort: 'asc',
      });
    });
  });

  it('should call the query function and update the state when fetch is invoked', async () => {
    mockQueryFunction.mockResolvedValue(mockQueryResponse);

    const { result } = renderHook(() =>
      useQueryApi<any>(mockQueryFunction, { defaultLimit })
    );

    await waitFor(() => {
      expect((result.all[1] as any).state.isLoading).toBe(true);
      expect(mockQueryFunction).toBeCalledTimes(1);
      expect(mockQueryFunction).toBeCalledWith('', baseQueryFunctionOptions);
      expect(result.current.state).toStrictEqual({
        data: mockQueryResponse.results,
        pagination: mockQueryResponse.pagination,
        searchString: '',
        isLoading: false,
        errorMessage: '',
        sort: 'asc',
      });
    });

    await act(async () => {
      await result.current.handleSearch('Test query');
    });

    await waitFor(() => {
      expect((result.all[3] as any).state.isLoading).toBe(true);
      expect(mockQueryFunction).toBeCalledTimes(2);
      expect(mockQueryFunction.mock.lastCall).toMatchObject([
        'Test query',
        baseQueryFunctionOptions,
      ]);
      expect(result.current.state).toStrictEqual({
        data: mockQueryResponse.results,
        pagination: mockQueryResponse.pagination,
        searchString: 'Test query',
        isLoading: false,
        errorMessage: '',
        sort: 'asc',
      });
    });

    await act(async () => {
      await result.current.handleSort('desc');
    });

    await waitFor(() => {
      expect((result.all[5] as any).state.isLoading).toBe(true);
      expect(mockQueryFunction).toBeCalledTimes(3);
      expect(mockQueryFunction.mock.lastCall).toMatchObject([
        'Test query',
        { ...baseQueryFunctionOptions, sort: 'desc' },
      ]);
      expect(result.current.state).toStrictEqual({
        data: mockQueryResponse.results,
        pagination: mockQueryResponse.pagination,
        searchString: 'Test query',
        isLoading: false,
        errorMessage: '',
        sort: 'desc',
      });
    });

    await act(async () => {
      await result.current.fetch();
    });

    await waitFor(() => {
      expect((result.all[7] as any).state.isLoading).toBe(true);
      expect(mockQueryFunction).toBeCalledTimes(4);
      expect(mockQueryFunction.mock.lastCall).toMatchObject([
        'Test query',
        { ...baseQueryFunctionOptions, sort: 'desc' },
      ]);
      expect(result.current.state).toStrictEqual({
        data: mockQueryResponse.results,
        pagination: mockQueryResponse.pagination,
        searchString: 'Test query',
        isLoading: false,
        errorMessage: '',
        sort: 'desc',
      });
    });
  });

  it('should call the query function and update the state when handleSearch is invoked', async () => {
    mockQueryFunction.mockResolvedValue(mockQueryResponse);

    const { result } = renderHook(() =>
      useQueryApi<any>(mockQueryFunction, { defaultLimit })
    );

    await waitFor(() => {
      expect((result.all[1] as any).state.isLoading).toBe(true);
      expect(mockQueryFunction).toBeCalledTimes(1);
      expect(mockQueryFunction).toBeCalledWith('', baseQueryFunctionOptions);
      expect(result.current.state).toStrictEqual({
        data: mockQueryResponse.results,
        pagination: mockQueryResponse.pagination,
        searchString: '',
        isLoading: false,
        errorMessage: '',
        sort: 'asc',
      });
    });

    await act(async () => {
      await result.current.handleSearch('Test query');
    });

    await waitFor(() => {
      expect((result.all[3] as any).state.isLoading).toBe(true);
      expect(mockQueryFunction).toBeCalledTimes(2);
      expect(mockQueryFunction.mock.lastCall).toMatchObject([
        'Test query',
        baseQueryFunctionOptions,
      ]);
      expect(result.current.state).toStrictEqual({
        data: mockQueryResponse.results,
        pagination: mockQueryResponse.pagination,
        searchString: 'Test query',
        isLoading: false,
        errorMessage: '',
        sort: 'asc',
      });
    });
  });

  it('should call the query function and update the state when handleSort is invoked', async () => {
    mockQueryFunction.mockResolvedValue(mockQueryResponse);

    const { result } = renderHook(() =>
      useQueryApi<any>(mockQueryFunction, { defaultLimit })
    );

    await waitFor(() => {
      expect((result.all[1] as any).state.isLoading).toBe(true);
      expect(mockQueryFunction).toBeCalledTimes(1);
      expect(mockQueryFunction).toBeCalledWith('', baseQueryFunctionOptions);
      expect(result.current.state).toStrictEqual({
        data: mockQueryResponse.results,
        pagination: mockQueryResponse.pagination,
        searchString: '',
        isLoading: false,
        errorMessage: '',
        sort: 'asc',
      });
    });

    await act(async () => {
      await result.current.handleSort('desc');
    });

    await waitFor(() => {
      expect((result.all[3] as any).state.isLoading).toBe(true);
      expect(mockQueryFunction).toBeCalledTimes(2);
      expect(mockQueryFunction.mock.lastCall).toMatchObject([
        '',
        { ...baseQueryFunctionOptions, sort: 'desc' },
      ]);
      expect(result.current.state).toStrictEqual({
        data: mockQueryResponse.results,
        pagination: mockQueryResponse.pagination,
        searchString: '',
        isLoading: false,
        errorMessage: '',
        sort: 'desc',
      });
    });
  });

  it('should call the query function and update the state when handleNextPage is invoked', async () => {
    mockQueryFunction.mockResolvedValueOnce(mockQueryResponse);

    const { result } = renderHook(() =>
      useQueryApi<any>(mockQueryFunction, { defaultLimit })
    );

    await waitFor(() => {
      expect((result.all[1] as any).state.isLoading).toBe(true);
      expect(mockQueryFunction).toBeCalledTimes(1);
      expect(mockQueryFunction).toBeCalledWith('', baseQueryFunctionOptions);
      expect(result.current.state).toStrictEqual({
        data: mockQueryResponse.results,
        pagination: mockQueryResponse.pagination,
        searchString: '',
        isLoading: false,
        errorMessage: '',
        sort: 'asc',
      });
    });

    mockQueryFunction.mockResolvedValueOnce({
      ...mockQueryResponse,
      pagination: {
        ...mockQueryResponse.pagination,
        nextCursor: null,
        prevCursor: 'prevCursor',
      },
    });

    await act(async () => {
      await result.current.paginationControls.handleNextPage();
    });

    await waitFor(() => {
      expect((result.all[3] as any).state.isLoading).toBe(true);
      expect(mockQueryFunction).toBeCalledTimes(2);
      expect(mockQueryFunction.mock.lastCall).toMatchObject([
        '',
        { ...baseQueryFunctionOptions, sort: 'asc' },
      ]);
      expect(result.current.state).toStrictEqual({
        data: mockQueryResponse.results,
        pagination: {
          nextCursor: null,
          prevCursor: 'prevCursor',
          limit: 20,
        },
        searchString: '',
        isLoading: false,
        errorMessage: '',
        sort: 'asc',
      });
    });
  });

  it('should call the query function and update the state when handlePrevPage is invoked', async () => {
    mockQueryFunction.mockResolvedValueOnce({
      ...mockQueryResponse,
      pagination: {
        ...mockQueryResponse.pagination,
        nextCursor: null,
        prevCursor: 'prevCursor',
      },
    });

    const { result } = renderHook(() =>
      useQueryApi<any>(mockQueryFunction, { defaultLimit })
    );

    await waitFor(() => {
      expect((result.all[1] as any).state.isLoading).toBe(true);
      expect(mockQueryFunction).toBeCalledTimes(1);
      expect(mockQueryFunction).toBeCalledWith('', baseQueryFunctionOptions);
      expect(result.current.state).toStrictEqual({
        data: mockQueryResponse.results,
        pagination: {
          nextCursor: null,
          prevCursor: 'prevCursor',
          limit: 20,
        },
        searchString: '',
        isLoading: false,
        errorMessage: '',
        sort: 'asc',
      });
    });

    mockQueryFunction.mockResolvedValueOnce(mockQueryResponse);

    await act(async () => {
      await result.current.paginationControls.handlePrevPage();
    });

    await waitFor(() => {
      expect((result.all[3] as any).state.isLoading).toBe(true);
      expect(mockQueryFunction).toBeCalledTimes(2);
      expect(mockQueryFunction.mock.lastCall).toMatchObject([
        '',
        { ...baseQueryFunctionOptions, sort: 'asc' },
      ]);
      expect(result.current.state).toStrictEqual({
        data: mockQueryResponse.results,
        pagination: mockQueryResponse.pagination,
        searchString: '',
        isLoading: false,
        errorMessage: '',
        sort: 'asc',
      });
    });
  });

  it('should update state when error occurs', async () => {
    mockQueryFunction.mockResolvedValueOnce(mockQueryResponse);

    const { result } = renderHook(() =>
      useQueryApi<any>(mockQueryFunction, {
        defaultLimit,
        errorMessage: 'Test error message',
      })
    );

    await waitFor(() => {
      expect((result.all[1] as any).state.isLoading).toBe(true);
      expect(mockQueryFunction).toBeCalledTimes(1);
      expect(mockQueryFunction.mock.lastCall).toMatchObject([
        '',
        { ...baseQueryFunctionOptions, sort: 'asc' },
      ]);
      expect(result.current.state).toStrictEqual({
        data: mockQueryResponse.results,
        pagination: mockQueryResponse.pagination,
        searchString: '',
        isLoading: false,
        errorMessage: '',
        sort: 'asc',
      });
    });

    mockQueryFunction.mockRejectedValueOnce(new Error());

    await act(async () => {
      await result.current.handleSearch('');
    });

    await waitFor(() => {
      expect((result.all[3] as any).state.isLoading).toBe(true);
      expect(mockQueryFunction).toBeCalledTimes(2);
      expect(mockQueryFunction).toBeCalledWith('', baseQueryFunctionOptions);
      expect(result.current.state).toStrictEqual({
        data: mockQueryResponse.results,
        pagination: {
          nextCursor: null,
          prevCursor: null,
          limit: 20,
        },
        searchString: '',
        isLoading: false,
        errorMessage: 'Test error message',
        sort: 'asc',
      });
    });
  });

  it('should use the options passed in', async () => {
    mockQueryFunction.mockResolvedValueOnce({
      ...mockQueryResponse,
      pagination: {
        limit: 500,
        nextCursor: 'nextCursor',
        prevCursor: null,
      },
    });

    const { result } = renderHook(() =>
      useQueryApi<any>(mockQueryFunction, {
        defaultLimit: 500,
        errorMessage: 'Another test error message',
      })
    );

    await waitFor(() => {
      expect((result.all[1] as any).state.isLoading).toBe(true);
      expect((result.all[1] as any).state.pagination.limit).toBe(500);
      expect(mockQueryFunction).toBeCalledTimes(1);
      expect(mockQueryFunction).toBeCalledWith('', {
        ...baseQueryFunctionOptions,
        pagination: {
          limit: 500,
        },
      });
      expect(result.current.state).toStrictEqual({
        data: mockQueryResponse.results,
        pagination: {
          ...mockQueryResponse.pagination,
          limit: 500,
        },
        searchString: '',
        isLoading: false,
        errorMessage: '',
        sort: 'asc',
      });
    });

    mockQueryFunction.mockRejectedValueOnce(new Error());

    await act(async () => {
      await result.current.handleSearch('Test query');
    });

    await waitFor(() => {
      expect((result.all[1] as any).state.isLoading).toBe(true);
      expect(result.current.state).toStrictEqual({
        data: mockQueryResponse.results,
        pagination: { nextCursor: null, prevCursor: null, limit: 500 },
        searchString: 'Test query',
        isLoading: false,
        errorMessage: 'Another test error message',
        sort: 'asc',
      });
    });
  });

  it('should use the default options if options are not passed in', async () => {
    mockQueryFunction.mockResolvedValueOnce({
      ...mockQueryResponse,
      pagination: {
        limit: DEFAULT_TABLE_LIMIT,
        nextCursor: 'nextCursor',
        prevCursor: null,
      },
    });

    const { result } = renderHook(() => useQueryApi<any>(mockQueryFunction));

    await waitFor(() => {
      expect((result.all[1] as any).state.isLoading).toBe(true);
      expect((result.all[1] as any).state.pagination.limit).toBe(
        DEFAULT_TABLE_LIMIT
      );
      expect(mockQueryFunction).toBeCalledTimes(1);
      expect(mockQueryFunction).toBeCalledWith('', {
        ...baseQueryFunctionOptions,
        pagination: {
          limit: DEFAULT_TABLE_LIMIT,
        },
      });
      expect(result.current.state).toStrictEqual({
        data: mockQueryResponse.results,
        pagination: {
          ...mockQueryResponse.pagination,
          limit: DEFAULT_TABLE_LIMIT,
        },
        searchString: '',
        isLoading: false,
        errorMessage: '',
        sort: 'asc',
      });
    });

    mockQueryFunction.mockRejectedValueOnce(new Error());

    await act(async () => {
      await result.current.handleSearch('Test query');
    });

    await waitFor(() => {
      expect((result.all[1] as any).state.isLoading).toBe(true);
      expect(result.current.state).toStrictEqual({
        data: mockQueryResponse.results,
        pagination: {
          nextCursor: null,
          prevCursor: null,
          limit: DEFAULT_TABLE_LIMIT,
        },
        searchString: 'Test query',
        isLoading: false,
        errorMessage: DEFAULT_API_QUERY_ERROR_MESSAGE,
        sort: 'asc',
      });
    });
  });
});
