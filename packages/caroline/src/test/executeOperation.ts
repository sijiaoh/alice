import { ApolloServer } from 'apollo-server-micro';
import { DocumentNode } from 'graphql';
import { Context } from 'src/server-types';

interface ExecuteOperationReturn<T> {
  data?: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: { [key: string]: any };
}

export const executeOperation = async <T, U>(
  apolloServer: ApolloServer,
  query: DocumentNode,
  variables: U,
  context: Context
): Promise<ExecuteOperationReturn<T>> => {
  const res = await apolloServer.executeOperation(
    {
      query,
      variables,
    },
    context
  );
  return res as ExecuteOperationReturn<T>;
};
