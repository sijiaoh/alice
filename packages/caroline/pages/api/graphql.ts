import 'reflect-metadata';

import { ApolloServer } from 'apollo-server-micro';
import { buildSchema } from '../../src/graphql/buildSchema';

const apolloServer = new ApolloServer({ schema: buildSchema() });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });
