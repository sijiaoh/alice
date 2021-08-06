import { createUser } from 'nextjs-utils/build/createUser';
import { clearDatabaseBetweenEachTest } from '../../../test-utils/build';
import { MeResolver } from './MeResolver';
import { apolloServer } from 'src/apolloServer';
import { UserEntity } from 'src/entities';
import { MeDocument, MeQuery, MeQueryVariables } from 'src/generated/graphql';
import { loginOptions } from 'src/loginOptions';
import { prepareConnection } from 'src/prepareConnection';
import { Context } from 'src/server-types';
import { authorizeTest } from 'src/test/authorizeTest';
import { executeOperation } from 'src/test/executeOperation';

clearDatabaseBetweenEachTest(prepareConnection);

describe(MeResolver.name, () => {
  describe(MeResolver.prototype.me.name, () => {
    describe('authorized', () => {
      it('return self profile', async () => {
        const user = await createUser<UserEntity>(loginOptions);
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
      authorizeTest<MeQuery, MeQueryVariables>(apolloServer, MeDocument, {});
    });
  });
});
