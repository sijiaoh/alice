import 'reflect-metadata';

import { callback } from 'nextjs-utils';
import { apiConnect } from 'src/apiConnect';
import { loginOptions } from 'src/loginOptions';
import { serverConfig } from 'src/serverConfig';

export default callback(apiConnect(), { ...serverConfig.data, loginOptions });
