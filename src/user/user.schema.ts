import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IsEmail, IsNotEmpty } from 'class-validator';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User>;

export type IUser = Omit<User, 'password'> & { _id: Types.ObjectId };

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  @IsNotEmpty()
  firstName: string;

  @Prop({ required: true })
  @IsNotEmpty()
  lastName: string;

  @Prop({ required: true, unique: true })
  @IsEmail()
  email: string;

  @Prop({ default: '' })
  password: string;

  @Prop({
    required: true,
    type: [{ type: Types.ObjectId, ref: 'Role' }],
  })
  roles: Array<Types.ObjectId>;

  @Prop()
  confirmationToken: string;

  @Prop({ default: false })
  verified: boolean;
}

// Schema factory
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};
