import { ApolloServer } from 'apollo-server-micro';
import { buildSchema } from './buildSchema';

export const apolloServer = new ApolloServer({ schema: buildSchema() });
