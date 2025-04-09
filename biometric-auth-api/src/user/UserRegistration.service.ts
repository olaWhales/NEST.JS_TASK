import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './dto/create-user.input';
import { UserResponse } from './dto/user.response';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegistrationService {
  constructor(private readonly prisma: PrismaService) {}

  async registerUser(input: CreateUserInput): Promise<UserResponse> {
    const { email, password } = input;

    // Check if the email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return {
      message: 'User registered successfully',
      user,
    };
  }
}