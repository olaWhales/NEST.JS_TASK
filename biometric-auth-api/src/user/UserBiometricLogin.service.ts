import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Import PrismaService
import { JwtService } from '@nestjs/jwt';
import { BiometricLoginInput } from './dto/biometric-login.input';
import { AuthPayload } from './dto/auth-payload.dto'; // Import AuthPayload

@Injectable()
export class BiometricLoginService {
  constructor(
    private readonly prisma: PrismaService, // Inject PrismaService
    private readonly jwtService: JwtService,
  ) {}

  async biometricLogin(data: BiometricLoginInput): Promise<AuthPayload> {
    const user = await this.prisma.user.findUnique({
      where: { biometricKey: data.biometricKey },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid biometric key');
    }

    const token = this.jwtService.sign({ userId: user.id });

    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      user: {
        id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        biometricKey: userWithoutPassword.biometricKey ?? undefined,
        createdAt: userWithoutPassword.createdAt,
        updatedAt: userWithoutPassword.updatedAt,
      },
    };
  }
}