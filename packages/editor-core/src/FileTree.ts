import { ReactiveClass } from '../../reactive-class/build';
import type { Repository, Revision } from './Repository';

export class FileTree extends ReactiveClass {
  constructor(repository: Repository, revision: Revision) {
    super();
    this.repository = repository;
    this.revision = revision;
    this.data = {};
  }

  createNewFile<T>(path: string, defaultContent: T) {
    const id = this.repository.fileManager.createNewFile<T>(defaultContent);
    this.data[path] = id;
    return id;
  }

  getFilePathFromId(id: string) {
    return Object.entries(this.data).find(([, datumId]) => datumId === id)?.[0];
  }

  private repository: Repository;
  private revision: Revision;
  private data: { [path: string]: string };
}
