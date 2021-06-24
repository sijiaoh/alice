import autobind from 'autobind-decorator';
import { ReactiveClass } from 'reactive-class';
import type { Repository } from './Repository';

/**
 * ファイルを普通に開いた時、revision='swap'。
 * その場合には、まずswapファイルのロードを試み、失敗した場合にnewファイルのロードをする。
 * save時にはrevision='new'で保存。
 * content更新時にはrevision='swap'で保存。
 * revision!='swap'なファイルは保存不可。
 */
@autobind
export class DynamicFile<T = unknown> extends ReactiveClass {
  readonly repository: Repository;
  readonly id: string;
  /** Is real path, not tree path. */
  readonly filePath: string;
  content: Readonly<T>;
  originalContent: Readonly<T>;
  changed = false;

  constructor({
    repository,
    id,
    content,
  }: {
    repository: Repository;
    id: string;
    content: T;
  }) {
    super();

    this.repository = repository;
    this.id = id;
    this.filePath = `files/${this.id}.json`;
    this.content = content;
    this.originalContent = this.content;

    this.observable.subscribe(() => {
      void (async () => {
        if (this.content === this.originalContent) return;
        this.changed = true;
        await this.save();
      })();
    });
  }

  async save({ force = false }: { force?: boolean } = {}) {
    if (!force && !this.changed) return;

    await this.repository.fileManager.fileDatabase.setFile(this);

    this.originalContent = this.content;
    this.changed = false;
    // TODO: Remove swap if need.
  }

  async remove() {
    await this.repository.fileManager.fileDatabase.removeFile(this);
    this.repository.fileManager.unlinkFile(this.id);
    this.destroy();
  }

  get path() {
    // TODO: FileTreeから取得。
    return this.id;
  }
}
