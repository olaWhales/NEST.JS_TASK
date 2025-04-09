import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { RegistrationService } from './UserRegistration.service';
import { LoginService } from './UserLogin.service';
import { BiometricLoginService } from './UserBiometricLogin.service';
import { CreateUserInput } from './dto/create-user.input';
import { UserResponse } from './dto/user.response'; // Use existing file

@Resolver()
export class UserResolver {
  constructor(
    private readonly registrationService: RegistrationService,
    private readonly loginService: LoginService,
    private readonly biometricLoginService: BiometricLoginService,
  ) {}

  @Mutation(() => UserResponse) // Use UserResponse
  async register(@Args('input') input: CreateUserInput) {
    return this.registrationService.registerUser(input);
  }

  // Add other methods (e.g., login, biometricLogin) as needed
}