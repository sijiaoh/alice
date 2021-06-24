import autobind from 'autobind-decorator';
import { Store } from './FileDatabase';
import { RepositoryManager } from './RepositoryManager';

@autobind
export class EditorCore {
  readonly store: Store;
  readonly repositoryManager = new RepositoryManager(this);

  constructor(store: Store) {
    this.store = store;
  }
}
