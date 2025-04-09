import { ObjectType, Field } from '@nestjs/graphql';
import { UserType } from './user.type';

@ObjectType()
export class UserResponse {
  @Field(() => String)
  message!: string;

  @Field(() => UserType)
  user!: UserType;
}