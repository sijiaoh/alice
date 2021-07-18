import { TypedConfig, Env, envs } from 'typed-config';

if (typeof window !== 'undefined')
  throw new Error('Do not import serverConfig from browser.');

const nextPublicEnv = process.env.NEXT_PUBLIC_ENV || 'development';

if (!envs.includes(nextPublicEnv as Env))
  throw new Error('NEXT_PUBLIC_ENV is illegal value.');
const env = nextPublicEnv as Env;

const production = process.env.NODE_ENV === 'production';
if (production && env !== 'staging' && env !== 'production')
  throw new Error(
    'NODE_ENV is production but NEXT_PUBLIC_ENV is not staging or production.'
  );

export const serverConfig = new TypedConfig(env, {
  URL: 'http://localhost:3000',

  MYSQL_HOST: 'localhost',
  MYSQL_PORT: '3306',
  // Sync with package.json prepareDatabase command.
  MYSQL_DATABASE: 'caroline',
  MYSQL_USERNAME: 'caroline',
  MYSQL_PASSWORD: 'caroline-password',

  GOOGLE_CLIENT_ID: env === 'test' ? '' : undefined,
  GOOGLE_CLIENT_SECRET: env === 'test' ? '' : undefined,
});
