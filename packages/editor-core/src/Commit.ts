import type { Repository } from './Repository';

export class Commit {
  static async load() {}

  static async save() {}

  constructor({
    repository,
    id,
    fileTreeId,
    message,
  }: {
    repository: Repository;
    id: string;
    fileTreeId: string;
    message: string;
  }) {
    this.repository = repository;
    this.id = id;
    this.fileTreeId = fileTreeId;
    this.message = message;
  }

  readonly repository: Repository;
  readonly id: string;
  readonly fileTreeId: string;
  readonly message: string;
}
