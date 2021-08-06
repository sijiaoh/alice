import 'reflect-metadata';

import { NextHandler } from 'next-connect';
import { apiConnect } from 'src/apiConnect';
import { apolloServer } from 'src/apolloServer';
import { serverConfig } from 'src/serverConfig';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const apolloMiddleware = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  await apolloServer.start();
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
  next();
};

const handler = apiConnect();
if (serverConfig.development) handler.get(apolloMiddleware);
handler.post(apolloMiddleware);

export default handler;
