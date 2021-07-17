import { createConnection, getConnection } from 'typeorm';
import { User, Repository } from './entities';
import { serverConfig } from './serverConfig';

export const prepareConnection = async () => {
  try {
    const staleConnection = getConnection();
    await staleConnection.close();
  } catch {
    // Do nothing.
  }

  await createConnection({
    type: 'mysql',
    host: serverConfig.data.MYSQL_HOST,
    port: parseInt(serverConfig.data.MYSQL_PORT, 10),
    username: serverConfig.data.MYSQL_USERNAME,
    password: serverConfig.data.MYSQL_PASSWORD,
    database: serverConfig.data.MYSQL_DATABASE,
    entities: [User, Repository],
    synchronize: !serverConfig.production,
    logging: false,
  });
};
