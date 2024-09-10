'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

import { AppError } from '../../errors/AppError';
import { useAuth } from '../../hooks/useAuth';

const LoadingPage = () => {
  return (
    <div
      data-testid="loading-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      <h1>Loading page...</h1>
    </div>
  );
};

const LoginPage = () => {
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const { loading, login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [userLogged, setUserLogged] = useState<string>('');
  const [error, setError] = useState<string>('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setUserLogged('');
    setError('');

    const response = await login(username, password);

    if (response instanceof AppError) {
      setError(response.message + ' ' + response.statusCode);

      return;
    }

    setUserLogged('User logged in successfully');

    router.push('/');
  }

  useEffect(() => {
    setTimeout(() => {
      setLoadingPage(false);
    }, 300);
  }, []);

  return loadingPage ? (
    <LoadingPage />
  ) : (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100vh',
      }}
    >
      {userLogged && <h2 style={{ marginBottom: '50px' }}>{userLogged}</h2>}

      {error && (
        <h2 style={{ marginBottom: '50px' }}>Error message: {error}</h2>
      )}

      <form
        onSubmit={onSubmit}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <input
          id="username-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          id="password-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          style={{ marginTop: '5px' }}
        />

        <button type="submit" disabled={loading} style={{ marginTop: '20px' }}>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
