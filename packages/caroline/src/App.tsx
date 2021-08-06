import autobind from 'autobind-decorator';
import { createContext, useContext, useRef } from 'react';
import { Props } from 'react-utils';
import { RepositoryManager } from './RepositoryManager';
import { Me } from 'src/Me';
import { Locale } from 'src/locale/Locale';

@autobind
export class App {
  static context = createContext<{ app?: App }>({});
  static instance: App;

  static Provider({ children }: Props) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const appRef = useRef(new App());
    const { Provider } = App.context;

    return <Provider value={{ app: appRef.current }}>{children}</Provider>;
  }

  static useApp() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { app } = useContext(this.context);
    if (!app) throw new Error('Do not call useApp outside of App.Provider.');
    return app;
  }

  me = new Me();
  locale = new Locale();
  repositoryManager = new RepositoryManager();

  constructor() {
    App.instance = this;
  }
}
