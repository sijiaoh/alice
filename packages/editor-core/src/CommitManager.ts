import { Commit } from './Commit';
import { FileManager } from './DynamicFileManager';
import { Repository } from './Repository';

export class CommitManager {
  constructor(repository: Repository) {
    this.repository = repository;
    this.fileManager = new FileManager(this);
  }

  async findOrLoadCommit(id: string) {
    const commit = this.commits[id];
    if (commit) return commit;
    this.commits[id] = new Commit({ repository: this.repository, id });
  }

  repository: Repository;
  fileManager: FileManager;
  commits: { [id: string]: Commit | undefined } = {};
}
