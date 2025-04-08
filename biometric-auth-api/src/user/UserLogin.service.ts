import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthPayload } from './dto/auth-payload.dto'; // Import AuthPayload
import { UserType } from './dto/user.type';



// const prisma = new PrismaClient(); // I created new instance here

@Injectable()
export class LoginService {
  constructor(
    private readonly prisma: PrismaClient, // I injected here instead of creating new
    private readonly jwtService: JwtService,
  ) {}
  // constructor(private readonly jwtService: JwtService) {}

  // async loginUser(email: string, password: string) {
  //   const user = await this.prisma.user.findUnique({ where: { email } });
  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
    async loginUser(email: string, password: string): Promise<AuthPayload> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // const token = this.jwtService.sign({ userId: user.id });
    // return { token, user };
      const token = this.jwtService.sign({ userId: user.id }); // Ensure token is generated
     return {
      token, // Add the token here
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
