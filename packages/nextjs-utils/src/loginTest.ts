import { clearDatabaseBetweenEachTest } from 'test-utils';
import { BaseEntity } from 'typeorm';
import { createProfile } from './createProfile';
import { createUser } from './createUser';
import { login, LoginOptions, User as LoginUser } from './login';
import { Request } from './server-types';

export const loginTest = (
  prepareConnection: () => Promise<void>,
  loginOptions: LoginOptions,
  {
    User,
    SocialProfile,
  }: { User: typeof BaseEntity; SocialProfile: typeof BaseEntity }
) => {
  clearDatabaseBetweenEachTest(prepareConnection);

  describe('Passport login.', () => {
    it('Create new user.', async () => {
      await login(
        {} as Request,
        createProfile(),
        (err) => {
          expect(err).toBeUndefined();
        },
        loginOptions
      );
      expect(await User.count()).toBe(1);
      expect(await SocialProfile.count()).toBe(1);
    });

    it('Normal login.', async () => {
      await createUser(loginOptions);

      await login(
        {} as Request,
        createProfile(),
        (err) => {
          expect(err).toBeUndefined();
        },
        loginOptions
      );
      expect(await User.count()).toBe(1);
      expect(await SocialProfile.count()).toBe(1);
    });

    it('Link other social account.', async () => {
      const userId = await createUser(loginOptions).then((user) => user.id);

      await login(
        { user: { id: userId } } as unknown as Request,
        createProfile({ provider: 'twitter' }),
        (err, user) => {
          expect(err).toBeUndefined();
          expect(user).toBeUndefined();
        },
        loginOptions
      );
      expect(await User.count()).toBe(1);
      expect(await SocialProfile.count()).toBe(2);
    });

    it('Login to another user with linked social profile.', async () => {
      await createUser(loginOptions);

      // Create another user.
      const userId = await new Promise<string>((resolve) => {
        void login(
          {} as Request,
          createProfile({ id: 'profileId2' }),
          (_, u) => {
            resolve((u as LoginUser).id);
          },
          loginOptions
        );
      });

      await login(
        { user: { id: userId } } as unknown as Request,
        createProfile(),
        (err, user) => {
          expect(err).toBeInstanceOf(Error);
          expect(user).toBeUndefined();
        },
        loginOptions
      );
      expect(await User.count()).toBe(2);
      expect(await SocialProfile.count()).toBe(2);
    });

    it('Login to user who is already linked to another social profile with this provider.', async () => {
      const userId = await createUser(loginOptions).then((user) => user.id);

      await login(
        { user: { id: userId } } as unknown as Request,
        createProfile({ id: 'profileId2' }),
        (err, user) => {
          expect(err).toBeInstanceOf(Error);
          expect(user).toBeUndefined();
        },
        loginOptions
      );
      expect(await User.count()).toBe(1);
      expect(await SocialProfile.count()).toBe(1);
    });
  });
};
