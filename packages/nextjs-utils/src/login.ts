import { Profile } from 'passport';
import { VerifyCallback } from 'passport-google-oauth20';
import { Request } from './server-types';

export interface User {
  id: string;
}

export interface SocialProfile {
  userId: string;
  user: User;
  save: () => Promise<SocialProfile>;
}

export interface FindSocialProfile {
  (profile: Profile): Promise<SocialProfile | undefined>;
}
export interface CreateSocialProfile {
  (user: User, profile: Profile): Promise<SocialProfile>;
}
export interface CreateUserWithSocialProfile {
  (profile: Profile): Promise<User>;
}

export interface LoginOptions {
  findSocialProfile: FindSocialProfile;
  createSocialProfile: CreateSocialProfile;
  createUserWithSocialProfile: CreateUserWithSocialProfile;
}

// Export for test.
export async function login(
  req: Request & { user?: User },
  profile: Profile,
  done: VerifyCallback,
  {
    findSocialProfile,
    createSocialProfile,
    createUserWithSocialProfile,
  }: LoginOptions
) {
  const socialProfile = await findSocialProfile(profile);

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
      const err = await createSocialProfile(req.user, profile)
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
    const user = await createUserWithSocialProfile(profile);
    done(undefined, user);
  }
}
