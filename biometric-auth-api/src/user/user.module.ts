import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RegistrationService } from './UserRegistration.service';
import { LoginService } from './classFolder/UserLogin.service';
import { BiometricLoginService } from './classFolder/UserBiometricLogin.service';
import { UserResolver } from './user.resolver';
import { PrismaModule } from '../PrismaModule';

@Module({
  imports: [
    ConfigModule, // Add ConfigModule to imports
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule for JwtModule
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
  ],
  providers: [
    RegistrationService,
    LoginService,
    BiometricLoginService,
    UserResolver,
  ],
  exports: [
    RegistrationService,
    LoginService,
    BiometricLoginService,
  ],
})
export class UserModule {}