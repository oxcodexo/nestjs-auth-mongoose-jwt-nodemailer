import { Module } from '@nestjs/common';
import { AppConfigService } from './config/env/env.config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { IsUniqueConstraint } from './common/validation/is-unique-constraint';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { AppConfigurationModule } from './config/env/env.config.module';
import { PaginationService } from './common/services/pagination.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { SeedService } from './common/services/seed.service';

@Module({
  imports: [
    AppConfigurationModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigurationModule],
      inject: [AppConfigService],
      useFactory: async (appConfigService: AppConfigService) => ({
        uri: appConfigService.mongoDbUri,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
    }),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
  ],
  providers: [
    AppConfigService,
    IsUniqueConstraint,
    SeedService,
    PaginationService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AppConfigService],
})
export class AppModule {}
