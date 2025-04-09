import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  hello(): string {
    return 'My name is Taoreed Olawale!';
  }
}
