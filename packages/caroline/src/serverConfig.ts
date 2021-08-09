import { TypedConfig } from 'typed-config';
import { env } from './env';

if (typeof window !== 'undefined')
  throw new Error('Do not import serverConfig from browser.');

export const serverConfig = new TypedConfig(env, {
  URL: 'http://localhost:3000',
  SESSION_SECRET: 'session-secret',

  MYSQL_HOST: 'localhost',
  MYSQL_PORT: '3306',
  // Sync with package.json prepareDatabase command.
  MYSQL_DATABASE: 'caroline',
  MYSQL_USERNAME: 'caroline',
  MYSQL_PASSWORD: 'caroline-password',

  GOOGLE_CLIENT_ID: env === 'test' ? 'dummy' : undefined,
  GOOGLE_CLIENT_SECRET: env === 'test' ? 'dummy' : undefined,
});
