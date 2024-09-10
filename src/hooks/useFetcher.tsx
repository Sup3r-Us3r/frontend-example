import axios from 'axios';
import { useCallback, useEffect, useReducer } from 'react';

type StateProps<T> = {
  data?: T;
  loading: boolean;
  error?: Error;
};

type ActionType<T> =
  | { type: 'loading' }
  | { type: 'fetched'; payload: T }
  | { type: 'error'; payload: Error };

function useFetcher<T = unknown>(url: string): StateProps<T> {
  const initialState: StateProps<T> = {
    data: undefined,
    loading: true,
    error: undefined,
  };

  function reducer(state: StateProps<T>, action: ActionType<T>) {
    switch (action.type) {
      case 'loading':
        return { ...state, loading: true } as StateProps<T>;
      case 'fetched':
        return {
          ...state,
          data: action.payload,
          loading: false,
        } as StateProps<T>;
      case 'error':
        return {
          ...state,
          error: action.payload,
          loading: false,
        } as StateProps<T>;
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleFetch = useCallback(async () => {
    dispatch({ type: 'loading' });

    try {
      const response = await axios.get<T>(url);

      dispatch({ type: 'fetched', payload: response.data });
    } catch (error) {
      if (axios.isAxiosError(error) || error instanceof Error) {
        dispatch({ type: 'error', payload: error });
      }
    }
  }, [url]);

  useEffect(() => {
    handleFetch();
  }, [handleFetch]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
  };
}

export { useFetcher };
