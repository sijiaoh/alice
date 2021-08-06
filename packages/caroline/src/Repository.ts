import autobind from 'autobind-decorator';
import { immerable } from 'immer';

@autobind
export class Repository {
  [immerable] = true;

  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
