import { SocialProfile, User } from './entities';
import { loginOptions } from './loginOptions';
import { loginTest } from './loginTest';
import { prepareConnection } from './prepareConnection';

loginTest(prepareConnection, loginOptions, { User, SocialProfile });
