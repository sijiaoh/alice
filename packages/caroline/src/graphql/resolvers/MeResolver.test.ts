import { clearDatabaseBetweenEachTest } from '../../../../test-utils/build';
import { MeResolver } from './MeResolver';
import { MeDocument, MeQuery, MeQueryVariables } from 'src/generated/graphql';
import { apolloServer } from 'src/graphql/apolloServer';
import { prepareConnection } from 'src/prepareConnection';
import { Context } from 'src/server-types';
import { createUser } from 'src/test/createUser';
import { executeOperation } from 'src/test/executeOperation';

clearDatabaseBetweenEachTest(prepareConnection);

describe(MeResolver.name, () => {
  describe(MeResolver.prototype.me.name, () => {
    describe('authorized', () => {
      it('return self profile', async () => {
        const user = await createUser();
        const res = await executeOperation<MeQuery, MeQueryVariables>(
          apolloServer,
          MeDocument,
          {},
          {
            req: { user },
          } as Context
        );
        expect(res.data?.me).toEqual({ id: user.id, penName: user.penName });
      });
    });

    describe('not authorized', () => {
      it('return error', async () => {
        const res = await executeOperation<MeQuery, MeQueryVariables>(
          apolloServer,
          MeDocument,
          {},
          { req: {} } as Context
        );
        expect(res.errors).toHaveLength(1);
      });
    });
  });
});
