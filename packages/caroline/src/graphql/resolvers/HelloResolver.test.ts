import { HelloResolver } from './HelloResolver';
import { HelloDocument } from 'src/generated/graphql';
import { apolloServer } from 'src/graphql/apolloServer';

describe(HelloResolver.name, () => {
  describe(HelloResolver.prototype.hello.name, () => {
    it('return hello world string', async () => {
      const res = await apolloServer.executeOperation({
        query: HelloDocument,
      });
      expect(res.data?.hello).toBe('hello world');
    });
  });
});
