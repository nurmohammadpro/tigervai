// src/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  MANAGER = 'manager',
  VENDOR = 'vendor',
  USER = 'user',
}

@Schema({ timestamps: true, autoIndex: true })
export class User {
  // ✔ role
  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  // ✔ general user fields
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  password: string;

  @Prop()
  address?: string;

  // ✔ Vendor-only fields
  @Prop()
  shopName?: string;

  @Prop()
  shopLogo?: string;

  @Prop()
  shopAddress?: string;

  @Prop()
  vendorDescription?: string;

  @Prop({ default: false })
  isDeleted: boolean;
  @Prop()
  slug: string;
  @Prop({default:true})
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
