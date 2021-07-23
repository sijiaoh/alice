import { clearDatabaseBetweenEachTest } from '../../../../test-utils/build';
import { RepositoryResolver } from './RepositoryResolver';
import { User, Repository } from 'src/entities';
import {
  CreateRepositoryDocument,
  CreateRepositoryMutation,
  CreateRepositoryMutationVariables,
  RepositoriesDocument,
  RepositoriesQuery,
  RepositoriesQueryVariables,
} from 'src/generated/graphql';
import { apolloServer } from 'src/graphql/apolloServer';
import { prepareConnection } from 'src/prepareConnection';
import { Context } from 'src/server-types';
import { createUser } from 'src/test/createUser';
import { executeOperation } from 'src/test/executeOperation';

beforeAll(prepareConnection);
clearDatabaseBetweenEachTest();

describe(RepositoryResolver.name, () => {
  describe(RepositoryResolver.prototype.createRepository.name, () => {
    it('can create new repository to user', async () => {
      const user = await createUser();
      const repositoryName = 'repository name';
      const res = await executeOperation<
        CreateRepositoryMutation,
        CreateRepositoryMutationVariables
      >(apolloServer, CreateRepositoryDocument, { name: repositoryName }, {
        req: { user },
      } as Context);
      expect(res.data?.createRepository.id).toBeTruthy();
      expect(res.data?.createRepository.name).toBe(repositoryName);
    });
  });

  describe(RepositoryResolver.prototype.repositories.name, () => {
    it("return user's repositories", async () => {
      const createRepository = (user: User, name: string) => {
        return Repository.create({ name, user }).save();
      };

      const user = await createUser();
      const repositoryName = 'repository name';

      const repositories = await Promise.all(
        [...Array(5)].map(() => {
          return createRepository(user, repositoryName);
        })
      );

      const res = await executeOperation<
        RepositoriesQuery,
        RepositoriesQueryVariables
      >(apolloServer, RepositoriesDocument, {}, {
        req: { user },
      } as Context);

      expect(
        res.data?.repositories.sort((a, b) => a.id.localeCompare(b.id))
      ).toEqual(
        repositories
          .map(({ id, name }) => ({ id, name }))
          .sort((a, b) => a.id.localeCompare(b.id))
      );
    });
  });
});
