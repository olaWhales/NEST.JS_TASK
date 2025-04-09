import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationService } from './UserRegistration.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UserResponse } from './dto/user.response';
import * as bcrypt from 'bcrypt';

// Mock the bcrypt module
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('RegistrationService', () => {
  let registrationService: RegistrationService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    registrationService = module.get<RegistrationService>(RegistrationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(registrationService).toBeDefined();
  });

  it('should register a user and return a success message', async () => {
    const input: CreateUserInput = { email: 'newuser@example.com', password: 'password123' };
    const hashedPassword = 'hashedPassword';
    const user = {
      id: '1',
      email: input.email,
      password: hashedPassword,
      biometricKey: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null); // No existing user
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
    jest.spyOn(prismaService.user, 'create').mockResolvedValue(user);

    const result = await registrationService.registerUser(input);

    expect(result.message).toBe('User registered successfully');
    expect(result.user).toEqual(user);
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: input.email } });
    expect(bcrypt.hash).toHaveBeenCalledWith(input.password, 10);
    expect(prismaService.user.create).toHaveBeenCalledWith({
      data: {
        email: input.email,
        password: hashedPassword,
      },
    });
  });

  it('should throw an error if user creation fails', async () => {
    const input: CreateUserInput = { email: 'test@example.com', password: 'password123' };

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({ id: '1', email: 'test@example.com' } as any);

    await expect(registrationService.registerUser(input)).rejects.toThrow('Email already exists');
  });
});