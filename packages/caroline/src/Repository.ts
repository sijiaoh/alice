import autobind from 'autobind-decorator';
import { v4 } from 'uuid';

type RepositoryCatalog = {
  [id: string]: { id: string; name: string } | undefined;
};

@autobind
export class Repository {
  static async getCatalog(): Promise<RepositoryCatalog> {
    // TODO: サーバーから取得する。
    return Promise.resolve({});
  }

  static create(name: string) {
    const id = v4();
    return new Repository(id, name);
  }

  static async load(id: string) {
    // TODO: サーバーから取得する。
    return Promise.resolve(new Repository(id, 'repository-name'));
  }

  private id: string;
  private name: string;

  private constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
