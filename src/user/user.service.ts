import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SALTOrROUNDS } from 'src/common/constants';
import { randomBytes } from 'crypto';
import { EmailService } from 'src/common/services/email.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationService } from './../common/services/pagination.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private emailService: EmailService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return this.createUser(createUserDto);
  }

  async createInitialUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      SALTOrROUNDS,
    );
    return this.createUser({ ...createUserDto, password: hashedPassword });
  }

  private async createUser(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    const savedUser = await newUser.save();
    return await this.populateUser(savedUser);
  }

  private async populateUser(user: UserDocument) {
    return await user.populate({
      path: 'roles',
      model: 'Role',
      populate: {
        path: 'permissions',
        model: 'Permission',
      },
    });
  }

  async verifyConfirmationToken(email: string, confirmationToken: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) throw new NotFoundException('User not found');
    if (user.verified)
      return {
        needsPasswordReset: user.password === '',
        message: 'This email is already verified',
      };

    if (user.confirmationToken !== confirmationToken)
      throw new NotFoundException('Invalid token');

    user.verified = true;
    user.confirmationToken = '';
    await user.save();

    return {
      needsPasswordReset: user.password === '',
      message: 'Email verified successfully',
    };
  }

  async setPassword(email: string, password: string) {
    const user = await this.findByEmail(email);
    user.password = await bcrypt.hash(password, SALTOrROUNDS);

    await user.save();
    return { message: 'Password set successfully' };
  }

  async resendVerificationEmail(email: string) {
    const user = await this.findByEmail(email);

    if (user.verified)
      return {
        message: 'The email is already verified, go to login',
        isAlreadyVerified: true,
      };

    await this.emailService.sendVerificationEmail(
      email,
      user.confirmationToken,
    );
    return {
      message: 'Verification email resent. Please check your inbox.',
      isAlreadyVerified: false,
    };
  }

  async findAll(query: PaginationQueryDto) {
    const { limit, skip } = this.paginationService.getPaginationOptions(query);
    const exp = this.buildSearchExpression(query);
    const [users, usersCount] = await Promise.all([
      this.userModel.find(exp).limit(limit).skip(skip).exec(),
      this.userModel.countDocuments(exp),
    ]);

    const populatedUsers = await Promise.all(
      users.map((user) => this.populateUser(user)),
    );

    return { data: populatedUsers, dataCount: usersCount };
  }

  async findOne<K extends keyof User>(query: { [key in K]: User[K] }) {
    const key = Object.keys(query)[0] as K;
    const user = await this.userModel.findOne({ [key]: query[key] });
    return user ? this.populateUser(user) : null;
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).exec();
    return this.populateUser(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
    return this.populateUser(updatedUser);
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async generateConfirmationToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      randomBytes(32, (err, buffer) => {
        if (err) {
          console.log('generateConfirmationToken Error: ', err);
          return reject(err);
        }
        resolve(buffer.toString('hex'));
      });
    });
  }

  private buildSearchExpression(query: PaginationQueryDto) {
    const { searchValue } = query;
    if (!searchValue) return {};
    const searchRegex = new RegExp(searchValue, 'i');
    return { $or: [{ name: searchRegex }] };
  }

  private async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
