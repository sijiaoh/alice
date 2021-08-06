import { createUser } from 'nextjs-utils/build/createUser';
import { clearDatabaseBetweenEachTest } from 'test-utils';
import { RepositoryResolver } from './RepositoryResolver';
import { apolloServer } from 'src/apolloServer';
import { UserEntity, RepositoryEntity } from 'src/entities';
import {
  CreateRepositoryDocument,
  CreateRepositoryMutation,
  CreateRepositoryMutationVariables,
  RepositoriesDocument,
  RepositoriesQuery,
  RepositoriesQueryVariables,
  RepositoryDocument,
  RepositoryQuery,
  RepositoryQueryVariables,
} from 'src/generated/graphql';
import { loginOptions } from 'src/loginOptions';
import { prepareConnection } from 'src/prepareConnection';
import { Context } from 'src/server-types';
import { executeOperation } from 'src/test/executeOperation';
import { authorizeTest } from 'src/test/authorizeTest';

clearDatabaseBetweenEachTest(prepareConnection);

describe(RepositoryResolver.name, () => {
  const repositoryName = 'repository name';

  describe(RepositoryResolver.prototype.createRepository.name, () => {
    authorizeTest<CreateRepositoryMutation, CreateRepositoryMutationVariables>(
      apolloServer,
      CreateRepositoryDocument,
      { name: repositoryName }
    );

    it('can create new repository to user', async () => {
      const user = await createUser(loginOptions);
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
    authorizeTest<RepositoriesQuery, RepositoriesQueryVariables>(
      apolloServer,
      RepositoriesDocument,
      {}
    );

    it("return user's repositories", async () => {
      const createRepository = async (user: UserEntity, name: string) => {
        return RepositoryEntity.create({ name, user }).save();
      };

      const user = await createUser<UserEntity>(loginOptions);

      const repositories = await Promise.all(
        [...Array(5)].map(async () => {
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

  describe(RepositoryResolver.prototype.repository.name, () => {
    authorizeTest<RepositoryQuery, RepositoryQueryVariables>(
      apolloServer,
      RepositoryDocument,
      { id: '' }
    );
  });
});
