import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { RegistrationService } from './UserRegistration.service';
import { LoginService } from './UserLogin.service';
import { BiometricLoginService } from './UserBiometricLogin.service';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { BiometricLoginInput } from './dto/biometric-login.input';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let registrationService: RegistrationService;
  let loginService: LoginService;
  let biometricLoginService: BiometricLoginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: RegistrationService,
          useValue: {
            registerUser: jest.fn(),
          },
        },
        {
          provide: LoginService,
          useValue: {
            loginUser: jest.fn(),
          },
        },
        {
          provide: BiometricLoginService,
          useValue: {
            biometricLogin: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    registrationService = module.get<RegistrationService>(RegistrationService);
    loginService = module.get<LoginService>(LoginService);
    biometricLoginService = module.get<BiometricLoginService>(BiometricLoginService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('register', () => {
    it('should call RegistrationService.registerUser and return the result', async () => {
      const input: CreateUserInput = { email: 'ajaditaoreed@gmail.com', password: 'password123' };
      const expectedResult = {
        token: 'User registered successfully', // Updated from "message" to "token"
        user: {
          id: '1',
          email: 'ajaditaoreed@gmail.com',
          biometricKey: null, // Updated from null to undefined
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      jest.spyOn(registrationService, 'registerUser').mockResolvedValue(expectedResult);

      const result = await resolver.register(input);

      expect(registrationService.registerUser).toHaveBeenCalledWith(input.email, input.password);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should call LoginService.loginUser and return the token', async () => {
      const input: LoginUserInput = { email: 'ajaditaoreed@gmail.com', password: 'password123' };
      const expectedToken = 'mocked-token';

      jest.spyOn(loginService, 'loginUser').mockResolvedValue({
        token: expectedToken,
        user: {
          id: '1',
          email: input.email,
          biometricKey: undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const result = await resolver.login(input);

      expect(loginService.loginUser).toHaveBeenCalledWith(input.email, input.password);
      expect(result).toEqual({ token: expectedToken }); // Updated to match the actual return value
    });
  });

  describe('biometricLogin', () => {
    it('should call BiometricLoginService.biometricLogin and return the token', async () => {
      const input: BiometricLoginInput = { biometricKey: 'valid-biometric-key' };
      const expectedToken = 'mocked-token';

      jest.spyOn(biometricLoginService, 'biometricLogin').mockResolvedValue({
        token: expectedToken,
        user: {
          id: '1', email: 'ajaditaoreed@gmail.com',
          password: '',
          biometricKey: null,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      });

      const result = await resolver.biometricLogin(input);

      expect(biometricLoginService.biometricLogin).toHaveBeenCalledWith(input.biometricKey);
      expect(result).toBe(expectedToken);
    });
  });
});
