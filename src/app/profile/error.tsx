'use client';

import { useEffect } from 'react';

interface IProfileErrorProps {
  error: Error;
  reset: () => void;
}

const ProfileError = ({ error, reset }: IProfileErrorProps) => {
  useEffect(() => {
    console.log('ERROR BOUNDARY PROFILE PAGE: ', error.message);
  }, [error]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        height: '100vh',
      }}
    >
      <h1>An unexpected error occurred</h1>
      <p>{error.message}</p>

      <button type="button" onClick={reset}>
        Reset error boundary
      </button>
    </div>
  );
};

export default ProfileError;
