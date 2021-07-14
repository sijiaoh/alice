import { apolloServer } from '../apolloServer';
import { HelloResolver } from './HelloResolver';

describe(HelloResolver.name, () => {
  describe(HelloResolver.prototype.hello.name, () => {
    it('return hello world string', async () => {
      const res = await apolloServer.executeOperation({
        query: `{hello}`,
      });
      expect(res.data?.hello).toBe('hello world');
    });
  });
});
