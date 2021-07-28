import { NextConnect } from 'next-connect';
import { getPassport, GetPassportOptions } from './getPassport';
import { Request, Response } from './server-types';

export const provide = (
  connect: NextConnect<Request, Response>,
  getPassportOptions: GetPassportOptions
) => {
  const passport = getPassport(getPassportOptions);
  return connect.use(passport.initialize()).get<Request>((req, res, next) => {
    passport.authenticate(req.query.provider, {
      scope: ['email'],
      session: false,
    })(req, res, next);
  });
};
