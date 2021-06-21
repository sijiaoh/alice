import autobind from 'autobind-decorator';
import { ReactiveClass } from 'reactive-class';
import type { Repository, Revision } from './Repository';

export interface FileData<T> {
  id: string;
  ctime: number;
  mtime: number;
  content: T;
}

/**
 * ファイルを普通に開いた時、revision='swap'。
 * その場合には、まずswapファイルのロードを試み、失敗した場合にnewファイルのロードをする。
 * save時にはrevision='new'で保存。
 * content更新時にはrevision='swap'で保存。
 * revision!='swap'なファイルは保存不可。
 */
@autobind
export class File<T = unknown> extends ReactiveClass {
  readonly repository: Repository;
  readonly revision: Revision;
  readonly id: string;
  /** Is real path, not tree path. */
  readonly filePath: string;
  content: Readonly<T>;
  originalContent: Readonly<T>;
  changed = false;

  constructor({
    repository,
    revision,
    id,
    defaultContent,
  }: {
    repository: Repository;
    revision: Revision;
    id: string;
    defaultContent: T;
  }) {
    super();

    this.repository = repository;
    this.revision = revision;
    this.id = id;
    this.filePath = `files/${this.id}.json`;
    this.content = defaultContent;
    this.originalContent = this.content;

    this.observable.subscribe(() => {
      if (this.content === this.originalContent) return;
      this.changed = true;
      this.save({ revision: 'swap' });
    });
  }

  save({
    revision = 'new',
    force = false,
  }: { revision?: Revision; force?: boolean } = {}) {
    if (this.revision !== 'swap') return;
    if (!force && !this.changed) return;

    const file = this.repository.store.getValue('new', this.filePath);
    const data = file ? (JSON.parse(file) as FileData<T>) : undefined;

    const now = Date.now();
    const newData: FileData<T> = {
      id: this.id,
      ctime: data?.ctime !== undefined ? data.ctime : now,
      mtime: now,
      content: this.content,
    };

    const newFile = JSON.stringify(newData, null, 2);
    this.repository.store.setValue(revision, this.filePath, newFile);

    if (revision === 'new') {
      this.originalContent = this.content;
      this.changed = false;
      this.repository.store.removeValue('swap', this.filePath);
    }
  }

  remove({ revision = 'new' }: { revision?: Revision } = {}) {
    if (this.revision === 'swap') {
      this.repository.store.removeValue(revision, this.filePath);
    }
    this.repository.fileManager.unlinkFile(this.id);
    this.destroy();
  }

  get path() {
    // TODO: FileTreeから取得。
    return this.id;
  }
}
