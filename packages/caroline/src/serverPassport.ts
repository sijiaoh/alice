import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { login } from './login';
import { Request } from './server-types';
import { serverConfig } from './serverConfig';

passport.use(
  new GoogleStrategy(
    {
      clientID: serverConfig.data.GOOGLE_CLIENT_ID,
      clientSecret: serverConfig.data.GOOGLE_CLIENT_SECRET,
      callbackURL: `${serverConfig.data.URL}/api/login/google/return`,
      passReqToCallback: true,
    },
    (req, _, __, profile, done) => {
      login(req as unknown as Request, profile, done).catch(done);
    }
  )
);

export const serverPassport = passport;
