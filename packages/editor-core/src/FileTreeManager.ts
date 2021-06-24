import { FileTree } from './FileTree';
import type { Repository, Revision } from './Repository';

export class FileTreeManager {
  static async create(repository: Repository) {
    const fileTree = await FileTree.create(repository, null);
    return new FileTreeManager(repository, fileTree);
  }

  readonly repository: Repository;

  private constructor(repository: Repository, fileTree: FileTree) {
    this.repository = repository;
    this.fileTree = fileTree;
  }

  async findOrLoadFileTree(revision: Revision) {
    // TODO: Load from store.
    return Promise.resolve(this.fileTree);
  }

  /** Revision null tree. */
  private readonly fileTree: FileTree;
  private readonly fileTrees: {
    [revision in Exclude<Revision, null>]: FileTree | undefined;
  } = {};
}
