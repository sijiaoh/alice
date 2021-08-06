import 'reflect-metadata';

import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import { apiConnect } from 'src/apiConnect';
import { createApolloServer } from 'src/createApolloServer';
import { serverConfig } from 'src/serverConfig';

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
  const apolloServer = createApolloServer();
  await apolloServer.start();
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
  next();
};

const handler = apiConnect();
if (serverConfig.development) handler.get(apolloMiddleware);
handler.post(apolloMiddleware);

export default handler;
