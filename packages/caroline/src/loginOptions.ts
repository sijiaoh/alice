import { LoginOptions } from 'nextjs-utils';
import { SocialProfileEntity, UserEntity } from 'src/entities';

export const loginOptions: LoginOptions = {
  findSocialProfile: async (profile) => {
    return SocialProfileEntity.findOne({
      where: { provider: profile.provider, token: profile.id },
    });
  },
  createSocialProfile: async (user, profile) => {
    return SocialProfileEntity.create({
      userId: user.id,
      provider: profile.provider,
      token: profile.id,
      email: profile.emails![0].value,
    }).save();
  },
  createUserWithSocialProfile: async (profile) => {
    return UserEntity.createWithSocialProfile(profile);
  },
};
