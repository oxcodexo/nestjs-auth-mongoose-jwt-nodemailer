import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IsUnique } from 'src/common/validation/is-unique';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({ timestamps: true })
export class Permission {
  @IsUnique({ modelName: Permission.name })
  @Prop({ required: true, unique: true })
  name: string;

  description: string;
}

export const PermissionModelName = Permission.name;

export const PermissionSchema = SchemaFactory.createForClass(Permission);
