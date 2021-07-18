import { Profile } from 'passport';
import { clearDatabase } from './clearDatabase';
import { SocialProfile } from './entities/SocialProfile';
import { User } from './entities/User';
import { login } from './login';
import { prepareConnection } from './prepareConnection';
import { Request } from './server-types';

beforeAll(async () => {
  await prepareConnection();
});

beforeEach(async () => {
  await clearDatabase();
});

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
  const createUser = async () => {
    await login({} as Request, createProfile(), () => {});
  };

  test('Create new user.', async () => {
    await login({} as Request, createProfile(), (err, u) => {
      const user = u as User;
      expect(err).toBeUndefined();
      expect(user!.id).toBe(1);
    });
    expect(await User.count()).toBe(1);
    expect(await SocialProfile.count()).toBe(1);
  });

  test('Normal login.', async () => {
    await createUser();

    await login({} as Request, createProfile(), (err, u) => {
      const user = u as User;
      expect(err).toBeUndefined();
      expect(user!.id).toBe(1);
    });
    expect(await User.count()).toBe(1);
    expect(await SocialProfile.count()).toBe(1);
  });

  test('Link other social account.', async () => {
    await createUser();

    await login(
      { user: { id: 1 } } as Request,
      createProfile({ provider: 'twitter' }),
      (err, user) => {
        expect(err).toBeUndefined();
        expect(user).toBeUndefined();
      }
    );
    expect(await User.count()).toBe(1);
    expect(await SocialProfile.count()).toBe(2);
    expect((await SocialProfile.findOne(2))?.userId).toBe(1);
  });

  test('Login to another user with linked social profile.', async () => {
    await createUser();

    // Create another user.
    await login({} as Request, createProfile({ id: 'profileId2' }), () => {});

    await login(
      { user: { id: 2 } } as Request,
      createProfile(),
      (err, user) => {
        expect(err).toBeInstanceOf(Error);
        expect(user).toBeUndefined();
      }
    );
    expect(await User.count()).toBe(2);
    expect(await SocialProfile.count()).toBe(2);
  });

  test('Login to user who is already linked to another social profile with this provider.', async () => {
    await createUser();

    await login(
      { user: { id: 1 } } as Request,
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
