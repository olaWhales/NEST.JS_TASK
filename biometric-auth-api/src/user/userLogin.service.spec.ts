import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './UserLogin.service';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginUserInput } from './dto/login-user.input';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findUnique: jest.fn(),
      },
    })),
  };
});

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('LoginService', () => {
  let service: LoginService;
  let prisma: jest.Mocked<PrismaClient>;
  let jwtService: JwtService;

  beforeEach(async () => {
    prisma = new PrismaClient() as jest.Mocked<PrismaClient>;

    jwtService = {
      sign: jest.fn().mockReturnValue('mocked-jwt-token'),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        { provide: PrismaClient, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login a user and return a token', async () => {
    const mockUser = {
      id: '1',
      email: 'ajaditaoreed@gmail.com',
      password: 'hashedPassword123',
      biometricKey: null, // Prisma returns null
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const input: LoginUserInput = { email: 'ajaditaoreed@gmail.com', password: 'password123' };
    const result = await service.loginUser(input);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'ajaditaoreed@gmail.com' } });
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword123');
    expect(jwtService.sign).toHaveBeenCalledWith({ userId: '1' });
    expect(result).toEqual({
      token: 'mocked-jwt-token',
      user: {
        id: '1',
        email: 'ajaditaoreed@gmail.com',
        biometricKey: undefined, // Expect undefined due to ?? undefined in service
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
      },
    });
  });

  it('should throw an error if credentials are invalid', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const input: LoginUserInput = { email: 'ajaditaoreed@gmail.com', password: 'password123' };
    await expect(service.loginUser(input)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw an error if the password is incorrect', async () => {
    const mockUser = {
      id: '1',
      email: 'ajaditaoreed@gmail.com',
      password: await bcrypt.hash('password123', 10),
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const input: LoginUserInput = { email: 'ajaditaoreed@gmail.com', password: 'wrongpassword' };
    await expect(service.loginUser(input)).rejects.toThrow(UnauthorizedException);
  });
});