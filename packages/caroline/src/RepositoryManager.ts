import { Repository } from './Repository';
import { sdk } from './sdk';

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
    const {
      createRepository: { id },
    } = await sdk.CreateRepository({ name });
    return this.load(id);
  }

  async load(id: string) {
    const existsRepository = this.repositories.find(
      (repository) => repository.id === id
    );
    if (existsRepository) return existsRepository;

    const { repository } = await sdk.Repository({ id });
    if (!this.repositoryList.some((elm) => elm.id === repository.id))
      this.repositoryList.push({ id, name: repository.name });
    if (!this.repositories.some((repo) => repo.id === id))
      this.repositories.push(repository);

    return repository;
  }
}
