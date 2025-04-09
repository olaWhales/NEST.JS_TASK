import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Import PrismaService
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';

@Injectable()
export class RegistrationService {
  constructor(private readonly prisma: PrismaService) {} // Inject PrismaService

  async registerUser(data: CreateUserInput) {
    const { email, password } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
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