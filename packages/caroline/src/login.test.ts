import { Profile } from 'passport';
import { SocialProfile } from './entities/SocialProfile';
import { User } from './entities/User';
import { login } from './login';
import { Request } from './server-types';

import './test-database';

export const createProfile = (attributes: Partial<Profile> = {}): Profile => {
  return {
    provider: 'google',
    id: 'profileId',
    displayName: '',
    emails: [{ value: 'email@email.com' }],
    ...attributes,
  };
};

describe('Passport login.', () => {
  const createUser = async () =>
    new Promise<User>((resolve) => {
      void login({} as Request, createProfile(), (_, user) => {
        resolve(user as User);
      });
    });

  it('Create new user.', async () => {
    await login({} as Request, createProfile(), (err) => {
      expect(err).toBeUndefined();
    });
    expect(await User.count()).toBe(1);
    expect(await SocialProfile.count()).toBe(1);
  });

  it('Normal login.', async () => {
    await createUser();

    await login({} as Request, createProfile(), (err) => {
      expect(err).toBeUndefined();
    });
    expect(await User.count()).toBe(1);
    expect(await SocialProfile.count()).toBe(1);
  });

  it('Link other social account.', async () => {
    const userId = await createUser().then((user) => user.id);

    await login(
      { user: { id: userId } } as unknown as Request,
      createProfile({ provider: 'twitter' }),
      (err, user) => {
        expect(err).toBeUndefined();
        expect(user).toBeUndefined();
      }
    );
    expect(await User.count()).toBe(1);
    expect(await SocialProfile.count()).toBe(2);
  });

  it('Login to another user with linked social profile.', async () => {
    await createUser();

    // Create another user.
    const userId = await new Promise<string>((resolve) => {
      void login({} as Request, createProfile({ id: 'profileId2' }), (_, u) => {
        resolve((u as User).id);
      });
    });

    await login(
      { user: { id: userId } } as unknown as Request,
      createProfile(),
      (err, user) => {
        expect(err).toBeInstanceOf(Error);
        expect(user).toBeUndefined();
      }
    );
    expect(await User.count()).toBe(2);
    expect(await SocialProfile.count()).toBe(2);
  });

  it('Login to user who is already linked to another social profile with this provider.', async () => {
    const userId = await createUser().then((user) => user.id);

    await login(
      { user: { id: userId } } as unknown as Request,
      createProfile({ id: 'profileId2' }),
      (err, user) => {
        expect(err).toBeInstanceOf(Error);
        expect(user).toBeUndefined();
      }
    );
    expect(await User.count()).toBe(1);
    expect(await SocialProfile.count()).toBe(1);
  });
});
