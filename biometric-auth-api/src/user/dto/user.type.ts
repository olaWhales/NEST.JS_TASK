import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UserType {
  @Field(() => String) // Explicitly specify the type as String
  id!: string;

  @Field(() => String) // Explicitly specify the type as String
  email!: string;

  @Field(() => String, { nullable: true }) // Optional field
  name?: string;

  @Field(() => String, { nullable: true }) // Explicitly specify the type as String
  biometricKey?: string;

  @Field(() => Date) // Explicitly specify the type as Date
  createdAt!: Date;

  @Field(() => Date) // Explicitly specify the type as Date
  updatedAt!: Date;
}
