import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from './user.resolver';
import { RegistrationService } from './UserRegistration.service';
import { LoginService } from './UserLogin.service';
import { BiometricLoginService } from './UserBiometricLogin.service';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from './dto/create-user.input';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    })),
  };
});

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

describe('UserResolver', () => {
  let resolver: UserResolver;
  let registrationService: RegistrationService;

  beforeEach(async () => {
    const prisma = new PrismaClient() as jest.Mocked<PrismaClient>;
    const jwtService = { sign: jest.fn().mockReturnValue('mocked-jwt-token') } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        RegistrationService,
        LoginService,
        BiometricLoginService,
        { provide: PrismaClient, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    registrationService = module.get<RegistrationService>(RegistrationService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  it('should register a user and return the result', async () => {
    const input: CreateUserInput = { email: 'ajaditaoreed@gmail.com', password: 'password123' };
    const expectedResult = {
      message: 'User registered successfully',
      user: {
        id: '1',
        email: 'ajaditaoreed@gmail.com',
        biometricKey: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    jest.spyOn(registrationService, 'registerUser').mockResolvedValue(expectedResult);

    const result = await resolver.register(input);

    expect(registrationService.registerUser).toHaveBeenCalledWith(input);
    expect(result).toEqual(expectedResult);
  });
});