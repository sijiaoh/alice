import { createConnection, getConnection } from 'typeorm';
import { config } from './config';
import * as entities from './entities';

export const prepareConnection = async () => {
  try {
    const staleConnection = getConnection();
    await staleConnection.close();
  } catch {
    // Do nothing.
  }

  await createConnection({
    type: 'mysql',
    host: config.data.MYSQL_HOST,
    port: parseInt(config.data.MYSQL_PORT, 10),
    username: config.data.MYSQL_USERNAME,
    password: config.data.MYSQL_PASSWORD,
    database: config.data.MYSQL_DATABASE,
    entities: Object.values(entities),
    synchronize: !config.production,
    logging: false,
  });
};
