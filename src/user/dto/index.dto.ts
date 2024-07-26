import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendVerificationEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class VerifyConfirmationTokenDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  confirmationToken: string;
}

export class SetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
