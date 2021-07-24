import fs from 'fs';
import path from 'path';
import { generate } from '@graphql-codegen/cli';

const projectCwd = process.env.PROJECT_CWD;

if (!projectCwd) throw new Error('PROJECT_CWD required.');

type Config = Parameters<typeof generate>[0];

const generateFile = async (config: Config) => {
  const res = await generate({ overwrite: true, ...config } as Config);
  const { filename, content } = res[0];
  await fs.promises.mkdir(path.dirname(filename), { recursive: true });
  await fs.promises.writeFile(filename, content);
};

void (async () => {
  await generateFile({
    schema: 'generated/schema.gql',
    generates: {
      'generated/all-queries.gql': {
        plugins: [
          `${projectCwd}/packages/server-graphql-generator/scripts/all-graphql-queries.js`,
        ],
      },
    },
  });

  await generateFile({
    schema: 'generated/schema.gql',
    documents: [
      'generated/all-queries.gql',
      'src/**/*.ts',
      'src/**/*.tsx',
      'src/**/*.gql',
    ],
    generates: {
      'src/generated/graphql.ts': {
        plugins: [
          'typescript',
          'typescript-operations',
          'typescript-graphql-request',
        ],
      },
    },
  });
})();
