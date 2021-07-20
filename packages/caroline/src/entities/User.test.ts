import { clearDatabaseBetweenEachTest } from 'test-utils';
import { SocialProfile } from './SocialProfile';
import { User } from './User';
import { prepareConnection } from 'src/prepareConnection';
import { createUser } from 'src/test/createUser';

beforeAll(async () => {
  await prepareConnection();
});

clearDatabaseBetweenEachTest();

describe(User.name, () => {
  describe('delete', () => {
    it('will delete own social profiles too', async () => {
      const user = await createUser();

      const socialProfiles = await User.findOne(user.id, {
        relations: ['socialProfiles'],
      }).then((u) => u?.socialProfiles);
      expect(socialProfiles?.[0]).toBeTruthy();

      await user.remove();
      expect(await SocialProfile.findOne(socialProfiles?.[0].id)).toBeFalsy();
    });
  });
});
