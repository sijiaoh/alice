import { NextConnect } from 'next-connect';
import { getPassport, GetPassportOptions } from './getPassport';
import { Request, Response } from './server-types';

export const callback = (
  connect: NextConnect<Request, Response>,
  getPassportOptions: GetPassportOptions
) => {
  const passport = getPassport(getPassportOptions);
  return connect
    .use(passport.initialize())
    .get<Request>((req, res, next) => {
      passport.authenticate(req.query.provider, {
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
};
