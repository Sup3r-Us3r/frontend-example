import { rest } from 'msw';
import { setupServer } from 'msw/node';
import type { ReactNode } from 'react';

import { renderHook, act } from '@testing-library/react-hooks';

import { AppError } from '../errors/AppError';
import { useAuth } from '../hooks/useAuth';
import { AuthContextProvider } from './AuthContext';

const server = setupServer(
  rest.post('https://dummyjson.com/auth/login', (_, response, ctx) => {
    return response(
      ctx.json({
        id: 1,
        username: 'jest',
        email: 'jest@mail.com',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
        image: 'https://github.com/Sup3r-Us3r.png',
        token: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      }),
    );
  }),
);

describe('AuthContext tests', () => {
  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();

    // restore the spy created with spyOn
    jest.restoreAllMocks();
  });

  afterAll(() => server.close());

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthContextProvider>{children}</AuthContextProvider>
  );

  it('should be able render hook with defined initial states', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.userData).toMatchObject({});
    expect(result.current.userLogged).toBeFalsy();
    expect(result.current.loading).toBeFalsy();
  });

  it('should be able to login successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    const localStorageSetItem = jest.spyOn(Storage.prototype, 'setItem');

    await act(async () => {
      result.current.login('jest', '123456');
    });

    expect(localStorageSetItem).toHaveBeenCalledWith(
      '@learning/userData',
      String(result.current.userData.id),
    );
    expect(result.current.userData).toMatchObject({
      id: 1,
      username: 'jest',
      email: 'jest@mail.com',
      firstName: 'John',
      lastName: 'Doe',
      gender: 'Male',
      image: 'https://github.com/Sup3r-Us3r.png',
      token: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    });
  });

  it('should be able to receive a status code 400 when passing the username and password incorrectly', async () => {
    server.use(
      rest.post('https://dummyjson.com/auth/login', (_, response, ctx) => {
        return response(
          ctx.status(400),
          ctx.json({ message: 'Invalid credentials' }),
        );
      }),
    );

    const localStorageRemoveItem = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const response = await result.current.login('ghost', '123456');

      expect(localStorageRemoveItem).toHaveBeenCalledWith('@learning/userData');
      expect(response).toBeInstanceOf(AppError);
      expect(response).toMatchObject({
        message: 'Invalid credentials',
        statusCode: 400,
      });
    });
  });

  it('should be able to get generic error message after login failure', async () => {
    server.use(
      rest.post('https://dummyjson.com/auth/login', (_, response, ctx) => {
        return response(ctx.status(500));
      }),
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    const localStorageRemoveItem = jest.spyOn(Storage.prototype, 'removeItem');

    await act(async () => {
      const response = await result.current.login('ghost', '123456');

      expect(localStorageRemoveItem).toHaveBeenCalledWith('@learning/userData');
      expect(response).toBeInstanceOf(AppError);
      expect(response).toMatchObject({
        message: 'There was an error logging in, please try again',
        statusCode: 500,
      });
    });
  });

  it('should be able', () => {
    const localStorageGetItem = jest.spyOn(Storage.prototype, 'getItem');

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.userData = {
        id: 1,
        username: 'jest',
        email: 'jest@mail.com',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
        image: 'https://github.com/Sup3r-Us3r.png',
        token: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      };
    });

    expect(localStorageGetItem).toHaveBeenCalledWith('@learning/userData');
    expect(result.current.userData).not.toEqual({});
  });
});
