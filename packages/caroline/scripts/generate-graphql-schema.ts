import 'reflect-metadata';

import { buildSchema } from 'src/graphql/buildSchema';

buildSchema({
  emitSchemaFile: `${process.cwd()}/generated/schema.gql`,
});
