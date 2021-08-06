import { Resolver, Query, Mutation, Ctx, Arg, Authorized } from 'type-graphql';
import { RepositoryEntity } from 'src/entities/RepositoryEntity';
import { Context } from 'src/server-types';
import { RepositoryType } from 'src/types/RepositoryType';

@Resolver()
export class RepositoryResolver {
  @Authorized()
  @Mutation(() => RepositoryType)
  async createRepository(
    @Ctx() { req }: Context,
    @Arg('name') name: string
  ): Promise<RepositoryType> {
    const user = req.user!;
    const repository = await RepositoryEntity.create({ name, user }).save();
    const { id } = repository;
    return { id, name };
  }

  @Authorized()
  @Query(() => RepositoryType)
  async repository(
    @Ctx() { req }: Context,
    @Arg('id') id: string
  ): Promise<RepositoryType> {
    const user = req.user!;
    const repository = await RepositoryEntity.findOne({
      where: { userId: user.id, id },
    });
    if (!repository) throw new Error('');

    return { id: repository.id, name: repository.name };
  }

  @Authorized()
  @Query(() => [RepositoryType])
  async repositories(@Ctx() { req }: Context): Promise<RepositoryType[]> {
    const user = req.user!;
    const repositories = await RepositoryEntity.find({
      where: { userId: user.id },
    });
    return repositories;
  }
}
