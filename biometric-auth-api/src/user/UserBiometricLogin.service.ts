import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class BiometricLoginService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
  ) {}

  async biometricLogin(biometricKey: string) {
    const user = await this.prisma.user.findUnique({ where: { biometricKey } });
    if (!user) {
      throw new UnauthorizedException('Invalid biometric key');
    }

    const token = this.jwtService.sign({ userId: user.id });
    return { token, user };
  }
}
