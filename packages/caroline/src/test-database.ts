/* eslint-disable @typescript-eslint/ban-ts-comment */

import { getConnection } from 'typeorm';
import * as entities from './entities';
import { prepareConnection } from './prepareConnection';
import { serverConfig } from './serverConfig';

if (!serverConfig.test)
  throw new Error(
    'Do not import test-database.ts outside of test environment.'
  );

export const clearDatabase = async () => {
  const connection = getConnection();

  await connection.query('set foreign_key_checks = 0;');

  const promises = Object.values(entities).map(async (entity) => {
    const { tableName } = connection.getRepository(entity).metadata;
    await connection.query(`truncate table \`${tableName}\`;`).catch(() => {});
  });

  await Promise.all(promises);

  await connection.query('set foreign_key_checks = 1;');
};

// @ts-ignore
beforeAll(async () => {
  await prepareConnection();
  await clearDatabase();
});

// @ts-ignore
afterEach(async () => {
  await clearDatabase();
});

// @ts-ignore
afterAll(async () => {
  const connection = getConnection();
  await connection.close();
});
