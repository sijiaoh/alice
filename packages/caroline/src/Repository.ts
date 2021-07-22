import autobind from 'autobind-decorator';

@autobind
export class Repository {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
