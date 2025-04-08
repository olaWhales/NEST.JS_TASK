// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { RegistrationService } from './UserRegistration.service';
// import { LoginService } from './UserLogin.service';
// import { BiometricLoginService } from './UserBiometricLogin.service';
// import { UserResolver } from './user.resolver';
// import { PrismaModule } from '../PrismaModule'; // assuming this is correct

// @Module({
//   imports: [
//     PrismaModule, // ✅ You missed this in the current version
//     JwtModule.register({
//       secret: 'supersecret', // ✅ replace with env variable in production
//       signOptions: { expiresIn: '1h' },
//     }),
//   ],
//   providers: [
//     RegistrationService,
//     LoginService,
//     BiometricLoginService,
//     UserResolver,
//   ],
//   exports: [
//     RegistrationService,
//     LoginService,
//     BiometricLoginService,
//   ],
// })
// export class UserModule {}
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegistrationService } from './UserRegistration.service';
import { LoginService } from './UserLogin.service';
import { BiometricLoginService } from './UserBiometricLogin.service';
import { UserResolver } from './user.resolver';
import { PrismaModule } from '../PrismaModule';

@Module({
  imports: [
    PrismaModule,

    // ✅ Use async config to pull secret from .env via ConfigService
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
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
