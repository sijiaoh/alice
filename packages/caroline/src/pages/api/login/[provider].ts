import 'reflect-metadata';

import { provide } from 'nextjs-utils';
import { apiConnect } from 'src/apiConnect';
import { loginOptions } from 'src/loginOptions';
import { serverConfig } from 'src/serverConfig';

export default provide(apiConnect(), { ...serverConfig.data, loginOptions });
