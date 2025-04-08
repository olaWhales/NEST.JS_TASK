import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegistrationService {
  constructor(private readonly prisma: PrismaClient) {}

  async registerUser(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });

    if (!newUser) {
      throw new Error('User creation failed');
    }

    const { password: _, ...userWithoutPassword } = newUser;
    return {
      message: 'User registered successfully',
      user: userWithoutPassword,
    };
  }
}