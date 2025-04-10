import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from '../user.resolver';
import { RegistrationService } from '../UserRegistration.service';
import { LoginService } from '../classFolder/UserLogin.service';
import { BiometricLoginService } from '../classFolder/UserBiometricLogin.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from '../dto/create-user.input';
import { LoginInput } from '../dto/login.input';
import { BiometricLoginInput } from '../dto/biometric-login.input';
import { UserResponse } from '../dto/user.response';
import * as bcrypt from 'bcrypt';

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
        PrismaService,
        JwtService,
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    registrationService = module.get<RegistrationService>(RegistrationService);
    loginService = module.get<LoginService>(LoginService);
    biometricLoginService = module.get<BiometricLoginService>(BiometricLoginService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('register', () => {
    it('should call RegistrationService.registerUser and return the result', async () => {
      const input: CreateUserInput = { email: 'test@example.com', password: 'password123' };
      const result: UserResponse = {
        message: 'User registered successfully',
        user: {
          id: '1',
          email: 'test@example.com',
          password: 'hashedPassword',
          biometricKey: null, // This is now valid
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      jest.spyOn(registrationService, 'registerUser').mockResolvedValue(result);

      const response = await resolver.register(input);

      expect(response).toEqual(result);
      expect(registrationService.registerUser).toHaveBeenCalledWith(input);
    });
  });

  describe('login', () => {
    it('should call LoginService.loginUser and return the result', async () => {
      const input: LoginInput = { email: 'test@example.com', password: 'password123' };
      const result: UserResponse = {
        message: 'Login successful',
        user: {
          id: '1',
          email: 'test@example.com',
          password: await bcrypt.hash('password123', 10),
          biometricKey: null, // This is now valid
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        token: 'jwt-token',
      };

      jest.spyOn(loginService, 'loginUser').mockResolvedValue(result);

      const response = await resolver.login(input);

      expect(response).toEqual(result);
      expect(loginService.loginUser).toHaveBeenCalledWith(input);
    });
  });

  describe('biometricLogin', () => {
    it('should call BiometricLoginService.biometricLogin and return the result', async () => {
      const input: BiometricLoginInput = { biometricKey: 'valid-key' };
      const result: UserResponse = {
        message: 'Biometric login successful',
        user: {
          id: '1',
          email: 'test@example.com',
          password: 'hashedPassword',
          biometricKey: 'valid-key',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        token: 'jwt-token',
      };

      jest.spyOn(biometricLoginService, 'biometricLogin').mockResolvedValue(result);

      const response = await resolver.biometricLogin(input);

      expect(response).toEqual(result);
      expect(biometricLoginService.biometricLogin).toHaveBeenCalledWith(input);
    });
  });
});