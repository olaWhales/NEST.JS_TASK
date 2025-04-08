import { ObjectType, Field } from '@nestjs/graphql';
import { UserType } from './user.type';

@ObjectType()
export class AuthPayload {
  @Field()
  token: string | undefined;

  @Field(() => UserType)
  user: UserType | undefined;
}
