import { Resolver, Query, Ctx, Arg } from 'type-graphql';
import { UserType } from 'src/graphql/types/UserType';
import { Context } from 'src/server-types';

@Resolver()
export class MeResolver {
  @Query(() => UserType)
  me(@Ctx() { req }: Context): UserType {
    const { user } = req;
    if (!user) throw new Error('Authorization required.');
    const { id, penName } = user;
    return { id, penName };
  }
}
