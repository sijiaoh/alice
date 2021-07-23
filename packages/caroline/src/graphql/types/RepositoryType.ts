import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class RepositoryType {
  @Field()
  id!: string;
  @Field()
  name!: string;
}
