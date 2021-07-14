import 'reflect-metadata';

import { apolloServer } from 'src/graphql/apolloServer';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });
