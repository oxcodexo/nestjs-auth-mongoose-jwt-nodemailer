import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigService } from 'src/config/env/env.config.service';
import { EmailService } from 'src/common/services/email.service';
import { PaginationService } from 'src/common/services/pagination.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, AppConfigService, EmailService, PaginationService],
  exports: [UserService, AppConfigService],
})
export class UserModule {}
