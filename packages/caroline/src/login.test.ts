import { loginTest } from 'nextjs-utils';
import { loginOptions } from './loginOptions';
import { prepareConnection } from './prepareConnection';

loginTest(prepareConnection, loginOptions);
