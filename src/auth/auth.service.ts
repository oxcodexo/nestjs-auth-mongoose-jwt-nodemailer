import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/user/user.service';
import * as bcrypt from 'bcrypt';
import { IUser } from '@/user/user.schema';
import { JwtService } from '@nestjs/jwt';
import { extractTokenFromHeader } from '@/common/utils/extract-token-from-header';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateAuth(email: string, password: string): Promise<IUser> {
    const user = await this.userService.findOne({ email });

    if (!user) return null;

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (isPasswordMatched) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...returnUser } = user.toObject();
      console.log('result', returnUser);
      return returnUser as IUser;
    }
    return null;
  }

  async login(user: IUser) {
    const payload = { aud: user, sub: user._id };

    const access_token = this.jwtService.sign(payload);
    return { data: access_token };
  }

  async validateToken(req: Request) {
    const token = extractTokenFromHeader(req);

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    return !!this.jwtService.verify(token);
  }
}
