import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { login, LoginOptions } from './login';
import { Request } from './server-types';

export interface GetPassportOptions {
  URL: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  loginOptions: LoginOptions;
}

export const getPassport = ({
  URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  loginOptions,
}: GetPassportOptions) => {
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: `${URL}/api/login/google/return`,
          passReqToCallback: true,
        },
        (req, _, __, profile, done) => {
          login(req as unknown as Request, profile, done, loginOptions).catch(
            done
          );
        }
      )
    );
  }
  return passport;
};
