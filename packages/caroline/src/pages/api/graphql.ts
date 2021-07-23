import 'reflect-metadata';

import { apolloServer } from 'src/graphql/apolloServer';
import { prepareConnection } from 'src/prepareConnection';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: Request, res: Response) => {
  await prepareConnection();
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
};
