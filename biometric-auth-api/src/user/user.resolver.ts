// import { Resolver, Mutation, Args } from '@nestjs/graphql';
// import { RegistrationService } from './UserRegistration.service';
// import { LoginService } from './UserLogin.service';
// import { BiometricLoginService } from './UserBiometricLogin.service';
// import { CreateUserInput } from './dto/create-user.input';
// import { LoginUserInput } from './dto/login-user.input';
// import { BiometricLoginInput } from './dto/biometric-login.input';

// @Resolver()
// export class UserResolver {
//   constructor(
//     private readonly registrationService: RegistrationService,
//     private readonly loginService: LoginService,
//     private readonly biometricLoginService: BiometricLoginService,
//   ) {}

//   @Mutation(() => Object)
//   async register(@Args('data') data: CreateUserInput) {
//     if (!data.email || !data.password) {
//       throw new Error('Email and password are required');
//     }
//     return this.registrationService.registerUser(data.email, data.password);
//   }

//   @Mutation(() => String)
//   async login(@Args('data') data: LoginUserInput) {
//     if (!data.email || !data.password) {
//       throw new Error('Email and password are required');
//     }
//     const { token } = await this.loginService.loginUser(data.email, data.password);
//     return token;
//   }

//   @Mutation(() => String)
//   async biometricLogin(@Args('data') data: BiometricLoginInput) {
//     const { token } = await this.biometricLoginService.biometricLogin(data.biometricKey);
//     return token;
//   }
// }
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { RegistrationService } from './UserRegistration.service';
import { LoginService } from './UserLogin.service';
import { BiometricLoginService } from './UserBiometricLogin.service';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { BiometricLoginInput } from './dto/biometric-login.input';
import { AuthPayload } from './dto/auth-payload.dto'; // ✅ You already have this

@Resolver()
export class UserResolver {
  constructor(
    private readonly registrationService: RegistrationService,
    private readonly loginService: LoginService,
    private readonly biometricLoginService: BiometricLoginService,
  ) {}

  // @Mutation(() => AuthPayload)
  // async register(@Args('data') data: CreateUserInput): Promise<AuthPayload> {
  //   if (!data.email || !data.password) {
  //     throw new Error('Email and password are required');
  //   }
  //   return this.registrationService.registerUser(data.email, data.password);
  // }

  // @Mutation(() => AuthPayload)
  // async login(@Args('data') data: LoginUserInput): Promise<AuthPayload> {
  //   if (!data.email || !data.password) {
  //     throw new Error('Email and password are required');
  //   }
  //   return this.loginService.loginUser(data.email, data.password);
  // }

  // @Mutation(() => AuthPayload)
  // async biometricLogin(@Args('data') data: BiometricLoginInput): Promise<AuthPayload> {
  //   return this.biometricLoginService.biometricLogin(data.biometricKey);
  // }
  @Mutation(() => AuthPayload)
async login(@Args('data') data: LoginUserInput): Promise<AuthPayload> {
  if (!data.email || !data.password) {
    throw new Error('Email and password are required');
  }
  const result = await this.loginService.loginUser(data.email, data.password);
  return {
    ...result,
    user: {
      ...result.user,
      id: result.user?.id ?? '', // Ensure 'id' is always provided
      email: result.user?.email ?? '', // Ensure 'email' is always provided
      biometricKey: result.user?.biometricKey ?? undefined,
      createdAt: result.user?.createdAt ?? new Date(), // Ensure 'createdAt' is always provided
      updatedAt: result.user?.updatedAt ?? new Date(), // Ensure 'updatedAt' is always provided
    },
  }; // result = { token, user }
}

@Mutation(() => AuthPayload)
async biometricLogin(@Args('data') data: BiometricLoginInput): Promise<AuthPayload> {
  const result = await this.biometricLoginService.biometricLogin(data.biometricKey);
  return {
    ...result,
    user: {
      ...result.user,
      biometricKey: result.user?.biometricKey ?? undefined,
      createdAt: result.user?.createdAt ?? new Date(), // Ensure 'createdAt' is always provided
      updatedAt: result.user?.updatedAt ?? new Date(), // Ensure 'updatedAt' is always provided
    },
  }; // result = { token, user }
}

@Mutation(() => AuthPayload)
async register(@Args('data') data: CreateUserInput): Promise<AuthPayload> {
  if (!data.email || !data.password) {
    throw new Error('Email and password are required');
  }
  const result = await this.registrationService.registerUser(data.email, data.password);
  if (!result.user) {
    throw new Error('Registration failed: User not provided');
  }
  return {
    token: result.message, // Assuming 'message' contains the authentication token or adjust as needed
    user: {
      ...result.user,
      biometricKey: result.user.biometricKey ?? undefined,
    },
  }; // result = { token, user }
}

}
