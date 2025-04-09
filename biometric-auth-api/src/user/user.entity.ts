import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id!: string; // Add ! to tell TypeScript this will be assigned

  @Field()
  email!: string; // Add !

  @Field()
  password!: string; // Add !

  @Field({ nullable: true })
  biometricKey!: string | null; // Add !

  @Field()
  createdAt!: Date; // Add !

  @Field()
  updatedAt!: Date; // Add !
}