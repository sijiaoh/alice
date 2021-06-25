import path from 'path';
import { Command } from 'commander';
import execa from 'execa';
import { env } from './generated/env';

const program = new Command();

const projectCwd = process.env.PROJECT_CWD;
if (!projectCwd) throw new Error('process.env.PROJECT_CWD cant not be falsy.');

const thisPath = path.join(projectCwd, 'packages', 'mysql');

const exec = async (
  command: string,
  args?: string[],
  options?: execa.Options
) => {
  return execa(command, args, {
    env: process.env,
    ...options,
  });
};

const execDockerCompose = async (args: string[], options?: execa.Options) => {
  await exec('docker-compose', args, {
    cwd: thisPath,
    env: { ...process.env, MYSQL_ROOT_PASSWORD: env.MYSQL_ROOT_PASSWORD },
    ...options,
  });
};

const execMysql = async (command: string, options?: execa.Options) => {
  await execDockerCompose(
    [
      'exec',
      '-T',
      'mysql',
      'mysql',
      '--user=root',
      `--password=${env.MYSQL_ROOT_PASSWORD}`,
      '-e',
      command,
    ],
    options
  );
};

const retryCommand = async (
  commandCallback: () => Promise<void>,
  successErrorStr?: string
) => {
  return new Promise<void>((resolve) => {
    const loop = () => {
      setTimeout(() => {
        void (async () => {
          try {
            await commandCallback();
            resolve();
          } catch (e) {
            if (
              successErrorStr &&
              e.stderr.toString().includes(successErrorStr)
            ) {
              resolve();
              return;
            }
            loop();
          }
        })();
      }, 100);
    };
    loop();
  });
};

const createDatabase = async (name: string) => {
  await retryCommand(async () => {
    await execMysql(`create database ${name}`);
  }, 'database exists');
};

const createUser = async (name: string, password: string) => {
  await retryCommand(async () => {
    await execMysql(`create user ${name} identified by '${password}'`);
  }, 'ERROR 1396');
};

const grantDatabaseToUser = async (userName: string, databaseName: string) => {
  await retryCommand(async () => {
    await execMysql(`grant all on ${databaseName}.* to ${userName}`);
  });
};

const up = async () => {
  await execDockerCompose(['up', '-d']);
};

program
  .command('prepare <databaseName> <userName> <userPassword>')
  .action(
    async (databaseName: string, userName: string, userPassword: string) => {
      await up();
      await createDatabase(databaseName);
      await createUser(userName, userPassword);
      await grantDatabaseToUser(userName, databaseName);
    }
  );

program.command('execMysql <command>').action(async (command: string) => {
  await execMysql(command, { stdio: 'inherit' });
});

program.parse(process.argv);
