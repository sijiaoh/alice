import { Resolver, Query, Ctx } from 'type-graphql';
import { Context } from 'src/server-types';
import { UserType } from 'src/types/UserType';

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
