import { createUser } from 'nextjs-utils/build/createUser';
import { clearDatabaseBetweenEachTest } from 'test-utils';
import { SocialProfileEntity } from './SocialProfileEntity';
import { UserEntity } from './UserEntity';
import { loginOptions } from 'src/loginOptions';
import { prepareConnection } from 'src/prepareConnection';

clearDatabaseBetweenEachTest(prepareConnection);

describe(UserEntity.name, () => {
  describe('delete', () => {
    it('will delete own social profiles too', async () => {
      const user = await createUser(loginOptions);

      const socialProfiles = await UserEntity.findOne(user.id, {
        relations: ['socialProfiles'],
      }).then((u) => u?.socialProfiles);
      expect(socialProfiles?.[0]).toBeTruthy();

      await user.remove();
      expect(
        await SocialProfileEntity.findOne(socialProfiles?.[0].id)
      ).toBeFalsy();
    });
  });

  describe('delete social profile', () => {
    it('will not delete user', async () => {
      const user = await createUser(loginOptions);

      const socialProfiles = await UserEntity.findOne(user.id, {
        relations: ['socialProfiles'],
      }).then((u) => u?.socialProfiles);
      expect(socialProfiles?.[0]).toBeTruthy();

      await socialProfiles?.[0].remove();
      expect(
        await SocialProfileEntity.findOne(socialProfiles?.[0].id)
      ).toBeFalsy();
      expect(await UserEntity.findOne(user.id)).toBeTruthy();
    });
  });
});
