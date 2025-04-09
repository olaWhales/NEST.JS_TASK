import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String) // Explicitly specify the type as String
  email!: string;

  @Field(() => String) // Explicitly specify the type as String
  password!: string;
}