import 'reflect-metadata';

import { apiConnect } from 'src/apiConnect';
import { Request, Response } from 'src/server-types';
import { serverPassport } from 'src/serverPassport';

export default apiConnect()
  .use(serverPassport.initialize())
  .get<Request>((req, res, next) => {
    serverPassport.authenticate(req.query.provider, {
      failureRedirect: '/',
      session: false,
    })(req, res, next);
  })
  .get<Request, Response>((req, res, next) => {
    if (!req.session || !req.user) {
      next(
        new Error(
          `req.session or req.user is falsy. session=${JSON.stringify(
            req.session
          )} user=${JSON.stringify(req.user)}`
        )
      );
      return;
    }

    req.session.accessToken = req.user.accessToken;
    res.redirect('/');
    next();
  });
