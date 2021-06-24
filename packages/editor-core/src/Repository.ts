import { ReactiveClass } from 'reactive-class';
import { v4 } from 'uuid';
import { BlobFileManager } from './BlobFileManager';
import { CommitManager } from './CommitManager';
import { FileManager } from './DynamicFileManager';
import { Store } from './FileDatabase';
import { FileTree } from './FileTree';
import { FileTreeManager } from './FileTreeManager';
import { RepositoryManager } from './RepositoryManager';

export type Revision = string | null;

export class Repository extends ReactiveClass {
  static async create(repositoryManager: RepositoryManager, name: string) {
    const id = v4();
    const repository = new Repository(repositoryManager, id);
    await repository.awake();
    await repository.init(name);
    await repository.save();
    return repository;
  }

  readonly repositoryManager: RepositoryManager;
  readonly id: string;
  name!: string;
  headCommitId: string;
  readonly commitManager: CommitManager;
  readonly fileManager: FileManager;
  /** @internal */
  readonly store: Store;
  /** @internal */
  readonly blobFileManager: BlobFileManager;

  toRepositoryPath(path: string) {
    return `repositories/${this.id}/${path}`;
  }

  private constructor(repositoryManager: RepositoryManager, id: string) {
    super();

    this.repositoryManager = repositoryManager;
    this.id = id;
    this.commitManager = new CommitManager(this);
    this.fileManager = new FileManager(this);
    this.blobFileManager = new BlobFileManager(this);

    const { store } = repositoryManager.editorCore;
    this.store = {
      getValue: async (key) => store.getValue(this.toRepositoryPath(key)),
      setValue: async (key, value) =>
        store.setValue(this.toRepositoryPath(key), value),
      removeValue: async (key) => store.removeValue(this.toRepositoryPath(key)),
    };
  }

  async awake() {}

  async init() {
    this.name = name;
  }

  async save() {
    const fileTree = this.fileTreeManager.findOrLoadFileTree(null);
    fileTree.createNewFile('.repository-name', this.name);
  }

  async remove() {
    // TODO: Remove repository from store.
    this.repositoryManager.unlinkRepository(this.id);
    this.destroy();
  }
}
