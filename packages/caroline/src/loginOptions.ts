import { LoginOptions } from 'nextjs-utils';
import { SocialProfile, User } from 'src/entities';

export const loginOptions: LoginOptions = {
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
};
