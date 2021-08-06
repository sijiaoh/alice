import {
  buildSchemaSync,
  NonEmptyArray,
  BuildSchemaOptions,
} from 'type-graphql';
import * as resolvers from './resolvers';
import { authChecker } from 'src/authChecker';

export const buildSchema = (options: Partial<BuildSchemaOptions> = {}) => {
  return buildSchemaSync({
    // eslint-disable-next-line @typescript-eslint/ban-types
    resolvers: Object.values(resolvers) as unknown as NonEmptyArray<Function>,
    authChecker,
    ...options,
  });
};
