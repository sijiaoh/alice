import { ReactiveClass } from '../../reactive-class/build';
import { Repository } from './Repository';
import { RepositoryType } from './generated/graphql';
import { sdk } from './sdk';

type RepositoryList = RepositoryType[];
type Repositories = Repository[];

export class RepositoryManager extends ReactiveClass<{
  repositoryList: RepositoryList;
  repositories: Repositories;
}> {
  constructor() {
    super({ repositoryList: [], repositories: [] });
  }

  async fetchRepositoryList(): Promise<RepositoryList> {
    const { repositories } = await sdk.Repositories();
    this.changeData((data) => {
      data.repositoryList = repositories;
    });
    return this.data.repositoryList;
  }

  async create(name: string) {
    const {
      createRepository: { id },
    } = await sdk.CreateRepository({ name });
    return this.load(id);
  }

  async load(id: string) {
    const existsRepository = this.data.repositories.find(
      (repository) => repository.id === id
    );
    if (existsRepository) return existsRepository;

    const { repository } = await sdk.Repository({ id });
    if (!this.data.repositoryList.some((elm) => elm.id === repository.id)) {
      this.changeData((data) => {
        data.repositoryList.push({ id, name: repository.name });
      });
    }
    if (!this.data.repositories.some((repo) => repo.id === id)) {
      this.changeData((data) => {
        data.repositories.push(repository);
      });
    }

    return repository;
  }
}
