import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../../user/user.entity'; 

@ObjectType()
export class UserResponse {
  @Field({ nullable: true })
  message?: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field({ nullable: true })
  token?: string;
}