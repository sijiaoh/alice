import 'reflect-metadata';

import { AppProps } from 'next/dist/next-server/lib/router/router';
import { App } from 'src/App';

import 'sanitize.css';
import 'sanitize.css/forms.css';
import 'sanitize.css/typography.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <App.Provider>
      <Component {...pageProps} />
      <div id="pop-ups" />
    </App.Provider>
  );
}
