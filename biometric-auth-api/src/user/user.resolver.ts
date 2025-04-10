import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { RegistrationService } from './UserRegistration.service';
import { LoginService } from './classFolder/UserLogin.service';
import { BiometricLoginService } from './classFolder/UserBiometricLogin.service';
import { CreateUserInput } from './dto/create-user.input';
import { LoginInput } from './dto/login.input'; // Import the new DTO
import { BiometricLoginInput } from './dto/biometric-login.input'; // Import the new DTO
import { UserResponse } from './dto/user.response';

@Resolver()
export class UserResolver {
  constructor(
    private readonly registrationService: RegistrationService,
    private readonly loginService: LoginService,
    private readonly biometricLoginService: BiometricLoginService,
  ) {}

  @Mutation(() => UserResponse)
  async register(@Args('input') input: CreateUserInput) {
    return this.registrationService.registerUser(input);
  }

  @Mutation(() => UserResponse)
  async login(@Args('input') input: LoginInput) {
    return this.loginService.loginUser(input);
  }

  @Mutation(() => UserResponse)
  async biometricLogin(@Args('input') input: BiometricLoginInput) {
    return this.biometricLoginService.biometricLogin(input);
  }
}