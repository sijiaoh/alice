import 'reflect-metadata';

import { AppProps } from 'next/dist/next-server/lib/router/router';
import { ReactiveClass } from 'reactive-class';
import { App } from 'src/App';

import 'sanitize.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReactiveClass.Provider>
      <App.Provider>
        <Component {...pageProps} />
      </App.Provider>
    </ReactiveClass.Provider>
  );
}
