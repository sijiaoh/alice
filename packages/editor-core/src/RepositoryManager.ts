import { v4 } from 'uuid';
import type { EditorCore } from './EditorCore';
import { Repository } from './Repository';

export class RepositoryManager {
  readonly editorCore: EditorCore;

  constructor(editorCore: EditorCore) {
    this.editorCore = editorCore;
  }

  createNewRepository(name: string) {
    const id = v4();
    const repository = new Repository(this, id);
    this.repositories[id] = repository;
    repository.name = name;
    return repository;
  }

  removeRepository(id: string) {
    this.repositories[id]?.remove();
  }

  /** @internal */
  unlinkRepository(id: string) {
    delete this.repositories[id];
  }

  private repositories: { [id: string]: Repository | undefined } = {};
}
