import { AuthChecker } from 'type-graphql';
import { Context } from './server-types';

export const authChecker: AuthChecker<Context> = ({ context }) => {
  return !!context.req.user;
};
