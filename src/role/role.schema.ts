import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({
    required: true,
    type: [{ type: Types.ObjectId, ref: 'Permission' }],
  })
  permissions: Array<Types.ObjectId>;
}

export const RoleModelName = Role.name;

export const RoleSchema = SchemaFactory.createForClass(Role);
