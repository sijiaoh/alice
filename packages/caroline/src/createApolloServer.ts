import { ApolloServer } from 'apollo-server-micro';
import { buildSchema } from './buildSchema';

export const createApolloServer = () =>
  new ApolloServer({
    schema: buildSchema(),
    context: (context) => context,
  });
