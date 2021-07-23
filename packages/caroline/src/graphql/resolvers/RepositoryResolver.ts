import { Resolver, Query, Mutation, Ctx, Arg } from 'type-graphql';
import { Repository } from 'src/entities/Repository';
import { RepositoryType } from 'src/graphql/types/RepositoryType';
import { Context } from 'src/server-types';

@Resolver()
export class RepositoryResolver {
  @Mutation(() => RepositoryType)
  async createRepository(
    @Arg('name') name: string,
    @Ctx() { req }: Context
  ): Promise<RepositoryType> {
    const { user } = req;
    if (!user) throw new Error('Authorization required.');
    const repository = await Repository.create({ name, user }).save();
    const { id } = repository;
    return { id, name };
  }

  @Query(() => [RepositoryType])
  async repositories(@Ctx() { req }: Context): Promise<RepositoryType[]> {
    const { user } = req;
    if (!user) throw new Error('Authorization required.');
    const repositories = await Repository.find({ where: { userId: user.id } });
    return repositories;
  }
}
