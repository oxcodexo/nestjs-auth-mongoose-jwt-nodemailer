import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './env.validation';
import { DEFAULT_PORT } from 'src/common/constants';

@Injectable()
export class AppConfigService {
  public port: number;
  public mongoDbUri: string;
  public jwtSecret: string;
  public jwtExpiresIn: string;
  public nodeMailService: string;
  public brandEmail: string;
  public brandEmailPwd: string;
  public contactUsEmail: string;

  constructor(private configService: ConfigService<EnvironmentVariables>) {
    this.port = this.configService.get<number>('PORT', DEFAULT_PORT);
    this.mongoDbUri = this.configService.get<string>('MONGO_DB_URI');
    this.jwtSecret = this.configService.get<string>('JWT_SECRET');
    this.jwtExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN');
    this.nodeMailService = this.configService.get<string>('NODE_MAIL_SERVICE');
    this.brandEmail = this.configService.get<string>('BRAND_EMAIL');
    this.brandEmailPwd = this.configService.get<string>('BRAND_EMAIL_PASSWORD');
    this.contactUsEmail = this.configService.get<string>('CONTACT_US_EMAIL');
  }
}
