import { loginTest } from 'nextjs-utils/build/loginTest';
import { loginOptions } from './loginOptions';
import { prepareConnection } from './prepareConnection';
import { UserEntity, SocialProfileEntity } from 'src/entities';

loginTest(prepareConnection, loginOptions, {
  User: UserEntity,
  SocialProfile: SocialProfileEntity,
});
