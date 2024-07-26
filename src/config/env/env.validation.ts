// src/config/env.validation.ts
import { IsString, IsNumber, IsEmail } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  MONGO_DB_URI: string;

  @IsNumber()
  PORT: number;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRES_IN: string;

  @IsEmail()
  BRAND_EMAIL: string;

  @IsString()
  BRAND_EMAIL_PASSWORD: string;

  @IsString()
  CONTACT_US_EMAIL: string;

  @IsString()
  NODE_MAIL_SERVICE: string;
}
