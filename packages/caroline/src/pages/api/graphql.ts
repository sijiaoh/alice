import 'reflect-metadata';

import { NextHandler } from 'next-connect';
import { apiConnect } from 'src/apiConnect';
import { apolloServer } from 'src/graphql/apolloServer';
import { serverConfig } from 'src/serverConfig';

export const config = {
  api: {
    bodyParser: false,
  },
};

const apolloMiddleware = async (
  req: Request,
  res: Response,
  next: NextHandler
) => {
  await apolloServer.createHandler({ path: '/api/graphql' })(req, res);
  next();
};

const handler = apiConnect();
if (serverConfig.development) handler.get(apolloMiddleware);
handler.post(apolloMiddleware);

export default handler;
