import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './UserLogin.service';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

import bcrypt from 'bcrypt';


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
  compare: jest.fn().mockResolvedValue(true), // Simulate successful password validation
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
    // Arrange
    const mockUser = {
      id: '1',
      email: 'ajaditaoreed@gmail.com',
      password: 'someHashedPassword',
      biometricKey: undefined, // Add this field
      createdAt: undefined, // Add this field
      updatedAt: undefined, // Add this field
    };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    // Act
    const result = await service.loginUser('ajaditaoreed@gmail.com', 'password123');

    // Assert
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'ajaditaoreed@gmail.com' } });
    expect(jwtService.sign).toHaveBeenCalledWith({ userId: '1' });
    expect(result).toEqual({
      token: 'mocked-jwt-token',
      user: {
        id: '1',
        email: 'ajaditaoreed@gmail.com',
        biometricKey: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      },
    });
  });

  it('should throw an error if credentials are invalid', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(service.loginUser('ajaditaoreed@gmail.com', 'password123')).rejects.toThrow(UnauthorizedException);
  });

  it('should throw an error if the password is incorrect', async () => {
    const mockUser = { id: '1', email: 'ajaditaoreed@gmail.com', password: await bcrypt.hash('password123', 10) };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false); //I simulate incorrect password here

    await expect(service.loginUser('ajaditaoreed@gmail.com', 'wrongpassword')).rejects.toThrow(UnauthorizedException);
  });
});