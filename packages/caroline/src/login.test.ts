import { clearDatabaseBetweenEachTest } from 'test-utils';
import { SocialProfile } from './entities/SocialProfile';
import { User } from './entities/User';
import { login } from './login';
import { prepareConnection } from './prepareConnection';
import { Request } from './server-types';
import { createProfile } from './test/createProfile';
import { createUser } from './test/createUser';

beforeAll(async () => {
  await prepareConnection();
});

clearDatabaseBetweenEachTest();

describe('Passport login.', () => {
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
