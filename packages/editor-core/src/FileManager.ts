import { v4 } from 'uuid';
import { File } from './File';
import type { Repository, Revision } from './Repository';

export class FileManager {
  private static toKey(revision: Revision, id: string) {
    return `${revision}:${id}`;
  }

  constructor(repository: Repository) {
    this.repository = repository;
  }

  findFile<T>(id: string) {
    return this.files[FileManager.toKey('swap', id)] as File<T>;
  }

  findOrLoadFile<T>(id: string, defaultContent: T) {
    const file = this.findFile<T>(id);
    if (file) return file;

    const newFile = new File<T>({
      repository: this.repository,
      revision: 'swap',
      id,
      defaultContent,
    });
    this.files[FileManager.toKey('swap', id)] = newFile;
    return newFile;
  }

  /**
   * @internal
   * 直接呼び出すことはない。
   * ファイルを作りたい時は、FileTree#createNewFileを呼び出す。
   */
  createNewFile<T>(defaultContent: T) {
    const id = v4();
    const file = new File<T>({
      repository: this.repository,
      revision: 'swap',
      id,
      defaultContent,
    });
    file.save({ force: true });
    return id;
  }

  removeFile(id: string) {
    this.files[id]?.remove();
  }

  /** @internal */
  unlinkFile(id: string) {
    delete this.files[id];
  }

  private readonly repository: Repository;
  /** key is ${revision}:${fileId} */
  private files: { [key: string]: File | undefined } = {};
}
