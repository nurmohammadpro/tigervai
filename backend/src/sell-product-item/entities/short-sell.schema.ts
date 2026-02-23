import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { globalSells } from 'lib/global-db/globaldb';

export type ShortSellDocument = HydratedDocument<ShortSell>;

@Schema({ timestamps: true })
export class ShortSell {
  @Prop({ required: true })
  productSlug: string;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  vendorId: string;

  @Prop({ required: true })
  vendorSlug: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  totalPrice: number;

  @Prop()
  brandName: string;

  @Prop()
  brandId: string;

  @Prop()
  mainCategory: string;

  @Prop()
  category: string;

  @Prop({ default: false })
  isAdmin: boolean;

  @Prop()
  sellLongRef: string; // Reference to long Sell document

  @Prop()
  orderStatus: string; // Reference to short Sell document
}

export const ShortSellSchema = SchemaFactory.createForClass(ShortSell);
