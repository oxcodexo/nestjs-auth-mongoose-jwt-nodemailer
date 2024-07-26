import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  ResendVerificationEmailDto,
  SetPasswordDto,
  VerifyConfirmationTokenDto,
} from './dto/index.dto';
import { Public } from 'src/common/decorators/skip-auth.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.userService.findAll(query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Public()
  @Post('verify-email')
  verifyConfirmationToken(
    @Body()
    { email, confirmationToken }: VerifyConfirmationTokenDto,
  ) {
    return this.userService.verifyConfirmationToken(email, confirmationToken);
  }

  @Public()
  @Post('set-password')
  setPassword(@Body() { email, password }: SetPasswordDto) {
    return this.userService.setPassword(email, password);
  }

  @Public()
  @Post('resend-verification-email')
  async resendVerificationEmail(@Body() { email }: ResendVerificationEmailDto) {
    return await this.userService.resendVerificationEmail(email);
  }
}
