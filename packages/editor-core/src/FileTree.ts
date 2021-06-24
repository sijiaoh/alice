import { ReactiveClass } from '../../reactive-class/build';
import type { Repository, Revision } from './Repository';

export class FileTree extends ReactiveClass {
  static async create(repository: Repository, revision: Revision) {
    const fileTree = new FileTree(repository, revision);
    await fileTree.load();
    return fileTree;
  }

  readonly parentTreeId: string | null;

  async createNewFile<T>(path: string, defaultContent: T) {
    const {fileId,blobId} = await this.repository.fileManager.createNewFile<T>(
      defaultContent
    );
    this.data[fileId] = { path, fileId, blobId };
    return fileId;
  }

  async removeFileWithId(id: string) {
    await this.repository.fileManager.removeFile(this.revision, id);
  }

  async removeFileWithPath(path: string) {
    const id = this.data[path];
    if (!id) return;
    await this.removeFileWithId(id);
  }

  getFilePathFromId(id: string) {
    return Object.entries(this.data).find(([, datumId]) => datumId === id)?.[0];
  }

  unlinkFileWithPath(path: string) {
    delete this.data[path];
  }

  unlinkFileWithId(id: string) {
    const path = this.getFilePathFromId(id);
    if (!path) return;
    this.unlinkFileWithPath(path);
  }

  private constructor(repository: Repository, revision: Revision) {
    super();
    this.repository = repository;
    this.revision = revision;
    this.parentTreeId = null;
    this.data = {};
  }

  private async load() {
    await this.repository.store;
  }

  private repository: Repository;
  private revision: Revision;
  private data: {
    [fileId: string]: { path: string; fileId: string; blobId: string };
  };
}
