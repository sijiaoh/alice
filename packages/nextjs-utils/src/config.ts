import { TypedConfig } from 'typed-config';

export const config = new TypedConfig('test', {
  MYSQL_HOST: 'localhost',
  MYSQL_PORT: '3306',
  // Sync with package.json prepareDatabase command.
  MYSQL_DATABASE: 'nextjs_utils_test',
  MYSQL_USERNAME: 'nextjs_utils',
  MYSQL_PASSWORD: 'nextjs-utils-password',
});
