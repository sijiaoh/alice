import { Context } from 'nextjs-utils';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { UserEntity } from 'src/entities';
import { serverConfig } from 'src/serverConfig';

@Resolver()
export class SessionResolver {
  @Mutation(() => Boolean)
  async debugLogin(@Ctx() { req }: Context, @Arg('id') id: string) {
    if (!serverConfig.development)
      throw new Error(
        'Can not use debugLogin outside of development environment.'
      );

    if (!id) throw new Error('id can not be empty.');
    let user = await UserEntity.findOne(id);
    if (!user) user = await UserEntity.create({ id }).save();
    req.session!.accessToken = user.accessToken;

    return true;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req }: Context) {
    req.session = null;
    return true;
  }
}
