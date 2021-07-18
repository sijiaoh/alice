import { getConnection } from 'typeorm';
import * as entities from './entities';
import { serverConfig } from './serverConfig';

if (!serverConfig.test)
  throw new Error('Do not import clearDatabase outside of test environment.');

export const clearDatabase = async () => {
  const promises = Object.values(entities).map(async (entity) => {
    const connection = getConnection();
    const { tableName } = connection.getRepository(entity).metadata;
    await connection.query(`TRUNCATE TABLE \`${tableName}\`;`).catch(() => {});
  });
  await Promise.all(promises);
};
