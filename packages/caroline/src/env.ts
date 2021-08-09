import { Env, envs } from 'typed-config';

const nextPublicEnv = process.env.NEXT_PUBLIC_ENV || 'development';

if (!envs.includes(nextPublicEnv as Env))
  throw new Error('NEXT_PUBLIC_ENV is illegal value.');
export const env = nextPublicEnv as Env;

const production = process.env.NODE_ENV === 'production';
if (production && env !== 'staging' && env !== 'production')
  throw new Error(
    'NODE_ENV is production but NEXT_PUBLIC_ENV is not staging or production.'
  );
