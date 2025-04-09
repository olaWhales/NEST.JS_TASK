import { Test, TestingModule } from '@nestjs/testing';
import { BiometricLoginService } from './UserBiometricLogin.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BiometricLoginInput } from './dto/biometric-login.input';
import { UserResponse } from './dto/user.response';

describe('BiometricLoginService', () => {
  let biometricLoginService: BiometricLoginService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BiometricLoginService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    biometricLoginService = module.get<BiometricLoginService>(BiometricLoginService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(biometricLoginService).toBeDefined();
  });

  it('should login a user with a valid biometric key', async () => {
    const input: BiometricLoginInput = { biometricKey: 'valid-key' };
    const user = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedPassword',
      biometricKey: input.biometricKey,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const token = 'jwt-token';

    jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(user);
    jest.spyOn(jwtService, 'sign').mockReturnValue(token);

    const result = await biometricLoginService.biometricLogin(input);

    expect(result.message).toBe('Biometric login successful');
    expect(result.user).toEqual(user);
    expect(result.token).toBe(token);
    expect(prismaService.user.findFirst).toHaveBeenCalledWith({ where: { biometricKey: input.biometricKey } });
    expect(jwtService.sign).toHaveBeenCalledWith({ userId: user.id, email: user.email });
  });

  it('should throw an error with an invalid biometric key', async () => {
    const input: BiometricLoginInput = { biometricKey: 'invalid-key' };

    jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

    await expect(biometricLoginService.biometricLogin(input)).rejects.toThrow('Invalid biometric key');
  });
});