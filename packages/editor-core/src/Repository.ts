import { ReactiveClass } from 'reactive-class';
import { FileManager } from './FileManager';
import { FileTree } from './FileTree';
import type { RepositoryManager } from './RepositoryManager';

export type Revision = 'swap' | 'new' | 'old';

export class Repository extends ReactiveClass {
  readonly store: {
    getValue: (revision: string, key: string) => string | undefined;
    setValue: (revision: string, key: string, value: string) => void;
    removeValue: (revision: string, key: string) => void;
  };
  readonly repositoryManager: RepositoryManager;
  readonly id: string;
  name: string;
  readonly fileTree: FileTree;
  readonly fileManager: FileManager;

  constructor(repositoryManager: RepositoryManager, id: string) {
    super();

    const { store } = repositoryManager.editorCore;
    const toStoreKey = (revision: string, key: string) =>
      `${id}/${revision}/${key}`;
    this.store = {
      getValue: (revision, key) => store.getValue(toStoreKey(revision, key)),
      setValue: (revision, key, value) =>
        store.setValue(toStoreKey(revision, key), value),
      removeValue: (revision, key) =>
        store.removeValue(toStoreKey(revision, key)),
    };

    this.repositoryManager = repositoryManager;
    this.id = id;
    // TODO: Try load from store.
    this.name = '';
    this.fileTree = new FileTree(this, 'new');
    this.fileManager = new FileManager(this);

    this.subscribe(() => {
      // TODO: Update repository file.
    });
  }

  remove() {
    // TODO: Remove repository from store.
    this.repositoryManager.unlinkRepository(this.id);
    this.destroy();
  }
}
