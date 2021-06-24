import { v4 } from 'uuid';
import { DynamicFile } from './DynamicFile';
import { FileDatabase } from './FileDatabase';
import type { Repository } from './Repository';

export class DynamicFileManager {
  readonly repository: Repository;
  readonly fileDatabase: FileDatabase;

  constructor(repository: Repository) {
    this.repository = repository;
    this.fileDatabase = new FileDatabase(
      repository,
      repository.repositoryManager.editorCore.store
    );
  }

  findFile<T>(id: string) {
    return this.files[id] as DynamicFile<T>;
  }

  async findOrLoadFile<T>(id: string) {
    const file = this.findFile<T>(id);
    if (file) return file;

    const headCommit = await this.repository.commitManager.findOrLoadCommit(
      this.repository.headCommitId
    );
    if (!headCommit) return undefined;
    const newFile = await this.fileDatabase.getFile<T>(headCommit, id);
    this.files[id] = newFile;
    return newFile;
  }

  /**
   * @internal
   * 直接呼び出すことはない。
   * ファイルを作りたい時は、FileTree#createNewFileを呼び出す。
   */
  async createNewFile<T>(content: T) {
    const id = v4();
    const file = new DynamicFile<T>({
      repository: this.repository,
      id,
      content,
    });
    await file.save({ force: true });
    return id;
  }

  /** @internal */
  unlinkFile(id: string) {
    delete this.files[id];
  }

  /** key is ${revision}:${fileId} */
  private files: { [id: string]: DynamicFile | undefined } = {};
}
