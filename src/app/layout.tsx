'use client';

import '../styles/globals.css';

import type { PropsWithChildren } from 'react';

import { Roboto } from '@next/font/google';

import { AuthContextProvider } from '../contexts/AuthContext';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: 'normal',
});

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html>
      <body
        className={roboto.className}
        style={{ width: '100%', height: '100vh' }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '1rem',
            width: '100%',
            padding: '1rem',
            backgroundColor: 'purple',
            color: '#FFFFFF',
            fontWeight: 'bold',
          }}
        >
          ROOT LAYOUT
        </header>

        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  );
};

export default RootLayout;
