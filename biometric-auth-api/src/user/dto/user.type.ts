import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string | undefined;

  @Field()
  email: string | undefined;

  @Field({ nullable: true })
  biometricKey?: string;

  @Field()
  createdAt: Date | undefined;

  @Field()
  updatedAt: Date | undefined;
}
