import { HelloResolver } from './HelloResolver';
import {
  HelloDocument,
  HelloQuery,
  HelloQueryVariables,
} from 'src/generated/graphql';
import { apolloServer } from 'src/graphql/apolloServer';
import { Context } from 'src/server-types';
import { executeOperation } from 'src/test/executeOperation';

describe(HelloResolver.name, () => {
  describe(HelloResolver.prototype.hello.name, () => {
    it('return hello world string', async () => {
      const res = await executeOperation<HelloQuery, HelloQueryVariables>(
        apolloServer,
        HelloDocument,
        {},
        {} as Context
      );
      expect(res.data?.hello).toBe('hello world');
    });
  });
});
