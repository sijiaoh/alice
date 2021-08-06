import { Resolver, Query, Ctx, Authorized } from 'type-graphql';
import { Context } from 'src/server-types';
import { UserType } from 'src/types/UserType';

@Resolver()
export class MeResolver {
  @Authorized()
  @Query(() => UserType)
  me(@Ctx() { req }: Context): UserType {
    const user = req.user!;
    const { id, penName } = user;
    return { id, penName };
  }
}
