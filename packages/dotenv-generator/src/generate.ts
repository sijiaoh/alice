import fs from 'fs';
import { EOL } from 'os';
import path from 'path';
import dotenv from 'dotenv';

export const generate = async (env = process.env.NODE_ENV) => {
  const base = dotenv.parse(
    await fs.promises.readFile(path.join(process.cwd(), '.env')).catch(() => '')
  );
  const overwritePath = path.join(process.cwd(), `.env${env ? `.${env}` : ''}`);
  const overwrite = dotenv.parse(
    await fs.promises.readFile(overwritePath).catch(() => '')
  );

  Object.keys(base).forEach((key) => {
    if (overwrite[key]) base[key] = overwrite[key];
    else if (!base[key])
      throw new Error(`${key} must set in ${overwritePath}.`);
  });

  return (
    [
      '// Generated by dotenv-generator.',
      `export const env = ${JSON.stringify(base, null, 2)};`,
    ].join(EOL) + EOL
  );
};
