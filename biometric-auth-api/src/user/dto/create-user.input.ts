import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  email: string | undefined;

  @Field()
  password: string | undefined;
}