import { ObjectType, Field } from '@nestjs/graphql';
import { UserType } from './user.type';

@ObjectType()
export class AuthPayload {
  @Field(() => String) // Explicitly specify the type as String
  token!: string;

  @Field(() => UserType) // Explicitly specify the type as UserType
  user!: UserType;
}
