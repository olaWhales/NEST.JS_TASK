import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from '../classFolder/UserLogin.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginInput } from '../dto/login.input';
import { UserResponse } from '../dto/user.response';
import * as bcrypt from 'bcrypt';

// Mock the bcrypt module
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('LoginService', () => {
  let loginService: LoginService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
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

    loginService = module.get<LoginService>(LoginService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(loginService).toBeDefined();
  });

  it('should login a user with valid credentials', async () => {
    const input: LoginInput = { email: 'test@example.com', password: 'password123' };
    const user = {
      id: '1',
      email: input.email,
      password: 'hashedPassword',
      biometricKey: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const token = 'jwt-token';

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    jest.spyOn(jwtService, 'sign').mockReturnValue(token);

    const result = await loginService.loginUser(input);

    expect(result.message).toBe('Login successful');
    expect(result.user).toEqual(user);
    expect(result.token).toBe(token);
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: input.email } });
    expect(bcrypt.compare).toHaveBeenCalledWith(input.password, user.password);
    expect(jwtService.sign).toHaveBeenCalledWith({ userId: user.id, email: user.email });
  });

  it('should throw an error with invalid credentials', async () => {
    const input: LoginInput = { email: 'test@example.com', password: 'wrongpassword' };

    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

    await expect(loginService.loginUser(input)).rejects.toThrow('Invalid credentials');
  });
});