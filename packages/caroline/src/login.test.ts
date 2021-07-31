import { loginTest } from 'nextjs-utils/build/loginTest';
import { loginOptions } from './loginOptions';
import { prepareConnection } from './prepareConnection';
import { User, SocialProfile } from 'src/entities';

loginTest(prepareConnection, loginOptions, { User, SocialProfile });
