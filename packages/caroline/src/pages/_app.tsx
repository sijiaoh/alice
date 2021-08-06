import 'reflect-metadata';

import { AppProps } from 'next/dist/next-server/lib/router/router';
import { App } from 'src/App';

import 'sanitize.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <App.Provider>
      <Component {...pageProps} />
    </App.Provider>
  );
}
