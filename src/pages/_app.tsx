import '../styles/globals.css';

import type { AppProps } from 'next/app';
import Head from 'next/head';

import { Roboto } from '@next/font/google';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: 'normal',
});

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Learning</title>
        <meta name="description" content="Learning new features" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={roboto.className}>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default App;
