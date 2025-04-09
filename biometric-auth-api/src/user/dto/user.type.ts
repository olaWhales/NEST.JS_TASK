import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true }) // Allow null explicitly
  biometricKey?: string | null; // Change from string | undefined to string | null | undefined

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}