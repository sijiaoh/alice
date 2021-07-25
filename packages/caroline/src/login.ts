import { Profile } from 'passport';
import { VerifyCallback } from 'passport-google-oauth20';
import { Request } from './server-types';
import { SocialProfile } from 'src/entities/SocialProfile';
import { User } from 'src/entities/User';

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
    const { user } = socialProfile;
    done(undefined, user);
  } else {
    // Sign up.
    const user = await User.createWithSocialProfile(profile);
    done(undefined, user);
  }
}
