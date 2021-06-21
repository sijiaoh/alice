import autobind from 'autobind-decorator';
import { RepositoryManager } from './RepositoryManager';

export interface Store {
  getValue: (key: string) => string | undefined;
  setValue: (key: string, value: string) => void;
  removeValue: (key: string) => void;
}

@autobind
export class EditorCore {
  readonly store: Store;
  readonly repositoryManager = new RepositoryManager(this);

  constructor(store: Store) {
    this.store = store;
  }
}
