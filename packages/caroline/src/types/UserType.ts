import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class UserType {
  @Field()
  id!: string;
  @Field()
  penName!: string;
}
