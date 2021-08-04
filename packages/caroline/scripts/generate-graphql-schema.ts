import 'reflect-metadata';

import { buildSchema } from 'src/buildSchema';

buildSchema({
  emitSchemaFile: `${process.cwd()}/generated/schema.gql`,
});
