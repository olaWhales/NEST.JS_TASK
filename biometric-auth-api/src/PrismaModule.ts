import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [
    {
      provide: PrismaClient,
      useValue: new PrismaClient(), // Provide an instance of PrismaClient
    },
  ],
  exports: [PrismaClient], // Export PrismaClient so it can be used in other modules
})
export class PrismaModule {}