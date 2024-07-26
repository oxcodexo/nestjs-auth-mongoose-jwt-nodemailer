import { Module } from '@nestjs/common';
import { UserModule } from '@/user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from '@/config/env/env.config.service';
import { AppConfigurationModule } from '@/config/env/env.config.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    AppConfigurationModule,
    JwtModule.registerAsync({
      global: true,
      imports: [AppConfigurationModule],
      inject: [AppConfigService],
      useFactory: async (appConfigService: AppConfigService) => ({
        secret: appConfigService.jwtSecret,
        signOptions: {
          expiresIn: appConfigService.jwtExpiresIn,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
