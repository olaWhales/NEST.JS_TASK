import { Test, TestingModule } from '@nestjs/testing';
import { BiometricLoginService } from './UserBiometricLogin.service';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { BiometricLoginInput } from './dto/biometric-login.input'; // Import BiometricLoginInput

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      user: {
        findUnique: jest.fn(),
      },
    })),
  };
});

describe('BiometricLoginService', () => {
  let service: BiometricLoginService;
  let prisma: jest.Mocked<PrismaClient>;
  let jwtService: JwtService;

  beforeEach(async () => {
    prisma = new PrismaClient() as jest.Mocked<PrismaClient>;

    jwtService = {
      sign: jest.fn().mockReturnValue('mocked-jwt-token'),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BiometricLoginService,
        { provide: PrismaClient, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<BiometricLoginService>(BiometricLoginService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login a user using biometric key and return a token', async () => {
    const mockUser = { id: '1', email: 'test@example.com', biometricKey: 'valid-key' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const input: BiometricLoginInput = { biometricKey: 'valid-key' };
    const result = await service.biometricLogin(input);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { biometricKey: 'valid-key' } });
    expect(jwtService.sign).toHaveBeenCalledWith({ userId: '1' });
    expect(result).toEqual({ token: 'mocked-jwt-token', user: mockUser });
  });

  it('should throw an error if biometric key is invalid', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const input: BiometricLoginInput = { biometricKey: 'invalid-key' };
    await expect(service.biometricLogin(input)).rejects.toThrow(UnauthorizedException);
  });
});