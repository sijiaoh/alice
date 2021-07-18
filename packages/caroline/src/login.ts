import passport, { Profile } from 'passport';
import {
  Strategy as GoogleStrategy,
  VerifyCallback,
} from 'passport-google-oauth20';
import { Request } from './server-types';
import { SocialProfile } from 'src/entities/SocialProfile';
import { User } from 'src/entities/User';
import { serverConfig } from 'src/serverConfig';

// Export for test.
export async function login(
  req: Request,
  profile: Profile,
  done: VerifyCallback
) {
  const socialProfile = await SocialProfile.findOne({
    where: { provider: profile.provider, token: profile.id },
  });

  // User is signed in.
  if (req.user) {
    // SocialProfile already exists.
    if (socialProfile) {
      if (req.user.id === socialProfile.userId) done(undefined);
      // Throw error(or change current user?).
      else {
        done(new Error('User is not a SocialProfile user.'));
      }
    }
    // SocialProfile does not exists.
    else {
      // Link new social account to user.
      const err = await SocialProfile.create({
        userId: req.user.id,
        provider: profile.provider,
        token: profile.id,
        email: profile.emails![0].value,
      })
        .save()
        .then<undefined>(() => undefined)
        .catch<Error>((e) => e);
      done(err);
    }
  }
  // User is not signed in.
  else if (socialProfile) {
    // Login.
    const user = await socialProfile.user;
    done(undefined, user);
  } else {
    // Sign up.
    const user = await User.createWithSocialProfile(profile);
    done(undefined, user);
  }
}

passport.use(
  new GoogleStrategy(
    {
      clientID: serverConfig.data.GOOGLE_CLIENT_ID,
      clientSecret: serverConfig.data.GOOGLE_CLIENT_SECRET,
      callbackURL: `${serverConfig.data.URL}/login/google/return`,
      passReqToCallback: true,
    },
    (req, _, __, profile, done) => {
      login(req as unknown as Request, profile, done).catch(done);
    }
  )
);
