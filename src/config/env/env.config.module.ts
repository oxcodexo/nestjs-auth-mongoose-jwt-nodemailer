// src/config/config.module.ts
import { Module } from '@nestjs/common';
import { EnvironmentVariables } from './env.validation';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppConfigService } from './env.config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config) => {
        const validatedConfig = plainToInstance(EnvironmentVariables, config, {
          enableImplicitConversion: true,
        });
        const errors = validateSync(validatedConfig);
        if (errors.length > 0) {
          throw new Error(errors.toString());
        }
        return validatedConfig;
      },
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigurationModule {}
