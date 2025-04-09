import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Import PrismaService
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from './dto/auth-payload.dto';
import { LoginUserInput } from './dto/login-user.input';

@Injectable()
export class LoginService {
  constructor(
    private readonly prisma: PrismaService, // Inject PrismaService
    private readonly jwtService: JwtService,
  ) {}

  async loginUser(data: LoginUserInput): Promise<AuthPayload> {
    const { email, password } = data;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ userId: user.id });
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        biometricKey: user.biometricKey ?? undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}