import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ShortProductDocument = HydratedDocument<ShortProduct>;
@Schema({ _id: false })
class ShortProductVariant {
  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  discountPrice?: number;

  @Prop({ default: 0 })
  stock: number;
}

@Schema({ timestamps: true })
export class ShortProduct {
  @Prop({ required: true })
  name: string;
  @Prop({default:true})
  isActive: boolean;

  // ✅ Only string for thumbnail URL
  @Prop({ required: true })
  thumbnail: string;

  // ✅ Only main category and category
  @Prop({ required: true })
  main: string;   // MEN / WOMEN / KIDS etc.

  @Prop({ required: true })
  category: string; // Shirt / Shoes / Watch etc.
  @Prop({ required: true })
  subMain: string; // Shirt / Shoes / Watch etc.

  @Prop({ required: true })
  price: number;

  @Prop()
  offerPrice?: number;

  @Prop({ default: false })
  hasOffer: boolean;

  @Prop({ default: false })
  isDigital: boolean;

  // ✅ Minimal brand info
  @Prop()
  brandId: string;

  @Prop({ required: true })
  brandName: string;

  @Prop({ unique: true })
  slug: string;

  @Prop({ default: false })
  isAdminCreated: boolean;

  // ✅ Flags for homepage sections
  @Prop({ default: false })
  hotDeals: boolean;

  @Prop({ default: false })
  hotOffer: boolean;

  @Prop({ default: false })
  productOfTheDay: boolean;

  @Prop()
  stock: number;

 

  @Prop({type:mongoose.Schema.Types.ObjectId})
  vendorId:mongoose.Schema.Types.ObjectId
    @Prop({ type: [ShortProductVariant], default: [] })
  variants: ShortProductVariant[];
}

export const ShortProductSchema = SchemaFactory.createForClass(ShortProduct);
