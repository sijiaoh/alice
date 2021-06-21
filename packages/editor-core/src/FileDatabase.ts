export type Revision = string | null;

export interface Store {
  getValue: (key: string) => Promise<string | undefined>;
  setValue: (key: string, value: string) => Promise<void>;
  removeValue: (key: string) => Promise<void>;
}

export class FileDatabase {
  readonly repositoryId: string;

  constructor(repositoryId: string, store: Store) {
    this.repositoryId = repositoryId;
    this.store = store;
  }

  getFilePath(revision: Revision, id: string) {
    return `${this.repositoryId}/${revision}/${id}`;
  }

  async getFile(revision: Revision, id: string) {
    return this.store.getValue(this.getFilePath(revision, id));
  }

  async setFile(revision: Revision, id: string, text: string) {
    return this.store.setValue(this.getFilePath(revision, id), text);
  }

  private readonly store: Store;
}
