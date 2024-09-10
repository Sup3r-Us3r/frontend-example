import { useRouter } from 'next/navigation';

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  waitForElementToBeRemoved,
} from '@test/testing-library';

import { AppError } from '../../errors/AppError';
import { useAuth } from '../../hooks/useAuth';
import LoginPage from './page';

jest.mock('../../hooks/useAuth', () => ({
  ...jest.requireActual('../../hooks/useAuth'),
  useAuth: jest.fn().mockReturnValue({}),
}));

jest.mock('next/navigation', () => ({
  ...jest.requireActual('../../hooks/useAuth'),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe('Login page tests', () => {
  beforeEach(() => jest.clearAllTimers());

  it('should be able render page', () => {
    render(<LoginPage />);

    expect(screen).toBeDefined();
  });

  it('should be able render and hide loading page component', async () => {
    render(<LoginPage />);

    expect(screen.getByTestId('loading-page')).toBeInTheDocument();

    await waitForElementToBeRemoved(screen.queryByTestId('loading-page'), {
      timeout: 400,
    });
  });

  it('should be able to render inputs and button with default values', async () => {
    render(<LoginPage />);

    await waitForElementToBeRemoved(screen.queryByTestId('loading-page'), {
      timeout: 400,
    });

    const usernameInput: HTMLInputElement =
      screen.getByPlaceholderText('Username');
    const passwordInput: HTMLInputElement =
      screen.getByPlaceholderText('Password');
    const loginButton: HTMLButtonElement = screen.getByText('Login');

    expect(usernameInput.value).toBe('');
    expect(usernameInput).toBeInTheDocument();
    expect(passwordInput.value).toBe('');
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toHaveTextContent('Login');
    expect(loginButton).toBeInTheDocument();
  });

  it('should be able to login successfully', async () => {
    const useAuthMocked = jest.mocked(useAuth);

    useAuthMocked.mockReturnValue({
      loading: false,
      userData: {
        id: 1,
        username: 'jest',
        email: 'jest@mail.com',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
        image: 'https://github.com/Sup3r-Us3r.png',
        token: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      },
      userLogged: true,
      login: jest.fn(),
    });

    await act(async () => {
      render(<LoginPage />);
    });

    await waitForElementToBeRemoved(screen.queryByTestId('loading-page'), {
      timeout: 400,
    });

    const usernameInput: HTMLInputElement =
      screen.getByPlaceholderText('Username');

    fireEvent.change(usernameInput, { target: { value: 'kminchelle' } });

    const passwordInput: HTMLInputElement =
      screen.getByPlaceholderText('Password');

    fireEvent.change(passwordInput, { target: { value: '0lelplR' } });

    const loginButton: HTMLButtonElement = screen.getByText('Login');

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(usernameInput.value).toBe('kminchelle');
      expect(passwordInput.value).toBe('0lelplR');
      expect(loginButton.type).toBe('submit');
      expect(
        screen.getByText('User logged in successfully'),
      ).toBeInTheDocument();
    });
  });

  it('should be able to fail login and get an error message with what happened', async () => {
    const useAuthMocked = jest.mocked(useAuth);

    useAuthMocked.mockReturnValue({
      loading: false,
      userData: {} as any,
      userLogged: false,
      // login: async (_: string, __: string): Promise<void | AppError> => {
      //   return new AppError('Invalid credentials');
      // },
      login: jest.fn().mockReturnValue(new AppError('Invalid credentials')),
    });

    await act(async () => {
      render(<LoginPage />);
    });

    await waitForElementToBeRemoved(screen.queryByTestId('loading-page'), {
      timeout: 400,
    });

    const usernameInput: HTMLInputElement =
      screen.getByPlaceholderText('Username');

    fireEvent.change(usernameInput, { target: { value: 'jest' } });

    const passwordInput: HTMLInputElement =
      screen.getByPlaceholderText('Password');

    fireEvent.change(passwordInput, { target: { value: 'jestPassword' } });

    const loginButton: HTMLButtonElement = screen.getByText('Login');

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(usernameInput.value).toBe('jest');
      expect(passwordInput.value).toBe('jestPassword');
      expect(loginButton.type).toBe('submit');
      expect(loginButton).not.toBeDisabled();
      expect(
        screen.getByText('Error message: Invalid credentials 400'),
      ).toBeInTheDocument();
    });
  });

  it('should be able to show loading message on button when loading state is true', async () => {
    const useAuthMocked = jest.mocked(useAuth);

    useAuthMocked.mockReturnValue({
      loading: true,
      userData: {} as any,
      userLogged: false,
      login: jest.fn(),
    });

    render(<LoginPage />);

    await waitForElementToBeRemoved(screen.queryByTestId('loading-page'), {
      timeout: 400,
    });

    const loginButton: HTMLButtonElement = screen.getByText('Loading...');

    expect(loginButton).toBeDisabled();
    expect(loginButton.textContent).toBe('Loading...');
  });

  it('should be able redirect user to home page after login successfully', async () => {
    const useAuthMocked = jest.mocked(useAuth);

    const useRouterMocked = jest.mocked(useRouter);
    const pushMocked = jest.fn();

    useAuthMocked.mockReturnValue({
      loading: false,
      userData: {
        id: 1,
        username: 'jest',
        email: 'jest@mail.com',
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
        image: 'https://github.com/Sup3r-Us3r.png',
        token: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      },
      userLogged: true,
      login: async (_: string, __: string): Promise<void | AppError> => {
        console.log();
      },
    });

    useRouterMocked.mockReturnValue({
      push: pushMocked,
    } as any);

    await act(async () => {
      render(<LoginPage />);
    });

    await waitForElementToBeRemoved(screen.queryByTestId('loading-page'), {
      timeout: 400,
    });

    const loginButton: HTMLButtonElement = screen.getByText('Login');

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(pushMocked).toHaveBeenCalledWith('/');
    });
  });
});
