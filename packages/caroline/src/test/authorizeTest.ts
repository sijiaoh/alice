import { ApolloServer } from 'apollo-server-micro';
import { DocumentNode } from 'graphql';
import { executeOperation } from './executeOperation';
import { Context } from 'src/server-types';

export const authorizeTest = <T, U>(
  apolloServer: ApolloServer,
  query: DocumentNode,
  variables: U,
  context: Context = { req: {} } as Context
) => {
  it('need authorize', async () => {
    const res = await executeOperation<T, U>(
      apolloServer,
      query,
      variables,
      context
    );
    expect(res.errors[0].message).toBe(
      'Access denied! You need to be authorized to perform this action!'
    );
  });
};
