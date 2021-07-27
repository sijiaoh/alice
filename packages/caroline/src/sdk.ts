import { GraphQLClient } from 'graphql-request';
import { getSdk } from './generated/graphql';

const client = new GraphQLClient('/api/graphql');
export const sdk = getSdk(client);
