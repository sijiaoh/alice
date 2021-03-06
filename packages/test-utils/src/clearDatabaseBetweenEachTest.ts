/* eslint-disable @typescript-eslint/ban-ts-comment */

import { getConnection } from 'typeorm';

export const resetDatabase = async () => {
  const connection = getConnection();
  await connection.synchronize(true);
};

export const clearDatabaseBetweenEachTest = (
  prepareConnection: () => Promise<void>
) => {
  // @ts-ignore
  beforeAll(async () => {
    await prepareConnection();
    await resetDatabase();
  });

  // @ts-ignore
  afterEach(async () => {
    await resetDatabase();
  });

  // @ts-ignore
  afterAll(async () => {
    const connection = getConnection();
    await connection.close();
  });
};
