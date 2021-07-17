import { TypedConfig, Env, envs } from 'typed-config';

const nextPublicEnv = process.env.NEXT_PUBLIC_ENV || 'development';

if (!envs.includes(nextPublicEnv as Env))
  throw new Error('NEXT_PUBLIC_ENV is illegal value.');
const env = nextPublicEnv as Env;

const production = process.env.NODE_ENV === 'production';
if (production && env !== 'staging' && env !== 'production')
  throw new Error(
    'NODE_ENV is production but NEXT_PUBLIC_ENV is not staging or production.'
  );

export const config = new TypedConfig(env, {
  // Sync with package.json prepareDatabase command.
  MYSQL_USERNAME: 'caroline',
  MYSQL_PASSWORD: 'caroline-password',
});
