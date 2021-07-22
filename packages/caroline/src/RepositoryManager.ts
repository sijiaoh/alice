import { v4 } from 'uuid';
import { Repository } from './Repository';

type RepositoryList = { id: string; name: string }[];
type Repositories = Repository[];

export class RepositoryManager {
  repositoryList: RepositoryList = [];
  repositories: Repositories = [];

  async fetchRepositoryList(): Promise<RepositoryList> {
    // TODO: サーバーから取得する。
    this.repositoryList = await Promise.resolve([]);
    return this.repositoryList;
  }

  async create(name: string) {
    const id = v4();
    // Call create repository graphql mutate.
    await Promise.resolve(name);
    return this.load(id);
  }

  async load(id: string) {
    const existsRepository = this.repositories.find(
      (repository) => repository.id === id
    );
    if (existsRepository) return existsRepository;

    // TODO: サーバーから取得する。
    const repository = await Promise.resolve(
      new Repository(id, 'repository-name')
    );

    if (!this.repositoryList.some((elm) => elm.id === repository.id))
      this.repositoryList.push({ id, name: repository.name });

    this.repositories.push(repository);
    return repository;
  }
}
