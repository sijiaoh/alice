import { HelloResolver } from './HelloResolver';
import { apolloServer } from 'src/apolloServer';
import {
  HelloDocument,
  HelloQuery,
  HelloQueryVariables,
} from 'src/generated/graphql';
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
