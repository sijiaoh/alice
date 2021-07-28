import { createProfile } from './createProfile';
import { SocialProfile, User } from './entities';
import { login } from './login';
import { Request } from './server-types';

export const createUser = async () => {
  return new Promise<User>((resolve) => {
    void login(
      {} as Request,
      createProfile(),
      (_, user) => {
        resolve(user as User);
      },
      {
        findSocialProfile: async (profile) => {
          return SocialProfile.findOne({
            where: { provider: profile.provider, token: profile.id },
          });
        },
        createSocialProfile: async (user, profile) => {
          return SocialProfile.create({
            userId: user.id,
            provider: profile.provider,
            token: profile.id,
            email: profile.emails![0].value,
          }).save();
        },
        createUserWithSocialProfile: async (profile) => {
          return User.createWithSocialProfile(profile);
        },
      }
    );
  });
};
