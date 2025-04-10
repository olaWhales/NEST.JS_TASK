import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BiometricLoginInput } from '../dto/biometric-login.input';
import { UserResponse } from '../dto/user.response';

@Injectable()
export class BiometricLoginService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async biometricLogin(input: BiometricLoginInput): Promise<UserResponse> {
    const { biometricKey } = input;

    const user = await this.prisma.user.findFirst({
      where: { biometricKey },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid biometric key');
    }

    const token = this.jwtService.sign({ userId: user.id, email: user.email });

    return {
      message: 'Biometric login successful',
      user,
      token,
    };
  }
}