import 'reflect-metadata';

import { apiConnect } from 'src/apiConnect';
import { Request } from 'src/server-types';
import { serverPassport } from 'src/serverPassport';

export default apiConnect()
  .use(serverPassport.initialize())
  .get<Request>((req, res, next) => {
    serverPassport.authenticate(req.query.provider, {
      scope: ['email'],
      session: false,
    })(req, res, next);
  });
