import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationService } from './UserRegistration.service';
import { PrismaClient } from '@prisma/client';
import { CreateUserInput } from './dto/create-user.input';
// import * as bcrypt from 'bcrypt';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        create: jest.fn(),
      },
    })),
  };
});

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

describe('RegistrationService', () => {
  let service: RegistrationService;
  let prisma: jest.Mocked<PrismaClient>;

  beforeEach(async () => {
    prisma = new PrismaClient() as jest.Mocked<PrismaClient>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationService,
        { provide: PrismaClient, useValue: prisma },
      ],
    }).compile();

    service = module.get<RegistrationService>(RegistrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a user and return a success message', async () => {
    const mockUser = { id: '1', email: 'ajaditaoreed@gmail.com', createdAt: new Date(), updatedAt: new Date() };
    (prisma.user.create as jest.Mock).mockResolvedValue(mockUser); // I ensure the mock returns a value here

    const result = await service.registerUser('ajaditaoreed@gmail.com', 'password123');

    // Assert
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { email: 'ajaditaoreed@gmail.com', password: 'hashed-password' },
    });
    expect(result).toEqual({
      message: 'User registered successfully',
      user: { id: '1', email: 'ajaditaoreed@gmail.com', createdAt: mockUser.createdAt, updatedAt: mockUser.updatedAt },
    });
  });

  it('should throw an error if user creation fails', async () => {
    (prisma.user.create as jest.Mock).mockResolvedValue(null); 

    await expect(service.registerUser('ajaditaoreed@gmail.com', 'password123')).rejects.toThrow('User creation failed');
  });
});

describe('register', () => {
  let service: RegistrationService;

  beforeEach(() => {
    service = new RegistrationService(new PrismaClient());
  });

  it('should call RegistrationService.registerUser and return the result', async () => {
    const input: CreateUserInput = { email: 'ajaditaoreed@gmail.com', password: 'password123' };
    const expectedResult = {
      message: 'User registered successfully', // Use "message" instead of "token"
      user: {
        id: '1',
        email: 'ajaditaoreed@gmail.com',
        biometricKey: null, // Change from undefined to null
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    const resolver = {
      register: jest.fn().mockResolvedValue(expectedResult),
    };

    jest.spyOn(service, 'registerUser').mockResolvedValue(expectedResult);

    const result = await resolver.register(input);

    expect(service.registerUser).toHaveBeenCalledWith(input.email, input.password);
    expect(result).toEqual(expectedResult); // Ensure the test expects the correct structure
  });
});