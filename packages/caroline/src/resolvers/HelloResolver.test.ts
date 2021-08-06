import { HelloResolver } from './HelloResolver';
import { createApolloServer } from 'src/createApolloServer';
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
        createApolloServer(),
        HelloDocument,
        {},
        {} as Context
      );
      expect(res.data?.hello).toBe('hello world');
    });
  });
});
