// src/sell/entities/sell.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type SellDocument = HydratedDocument<Sell>;

export enum PaymentMethod {
  COD = 'COD',
  ONLINE = 'ONLINE',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

// ✅ NEW: Variant info for order tracking
@Schema({ _id: false })
class OrderProductVariant {
  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  color: string;

  @Prop()
  sku?: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  discountPrice?: number;
}

@Schema({ _id: false })
class SellProductItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, ref: 'Product' })
  productId: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  totalPrice: number;

  // ✅ NEW: Variant info - if customer orders same product with different variants, it's separate line item
  @Prop({ type: OrderProductVariant, required: true })
  variant: OrderProductVariant;

  @Prop()
  brandName: string;

  @Prop()
  brandId: string;

  @Prop()
  mainCategory: string;

  @Prop()
  category: string;

  @Prop()
  vendorId: string;

  @Prop()
  vendorSlug: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  shortSellRef: MongooseSchema.Types.ObjectId;

  // ✅ NEW: Store actual price at time of purchase (for historical records)
  @Prop({ required: true })
  unitPrice: number; // Price per unit at time of order

  // ✅ NEW: Discount applied at time of purchase
  @Prop({ default: 0 })
  discountApplied?: number;
}

@Schema({ _id: false })
class ShipmentDetails {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  house: string;

  @Prop({ required: true, enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Prop()
  comment: string;
  @Prop()
  thana: string;
  @Prop()
  district: string;
}

@Schema({ timestamps: true })
export class Sell {
  @Prop({ type: [SellProductItem], required: true })
  products: SellProductItem[];

  @Prop({ type: ShipmentDetails, required: true })
  shipment: ShipmentDetails;

  @Prop({ type: MongooseSchema.Types.ObjectId})
  userId: string;

  @Prop({ required: true })
  isAdmin: boolean;

  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  orderStatus: OrderStatus;

  // ✅ NEW: Track order total
  @Prop({ required: true, default: 0 })
  orderTotal: number;

  // ✅ NEW: Track discount/coupon applied
  @Prop({ default: 0 })
  totalDiscount?: number;

  @Prop()
  orderNumber?: string;
  @Prop({type: MongooseSchema.Types.ObjectId})
  vendorId?:  MongooseSchema.Types.ObjectId;
}

export const SellSchema = SchemaFactory.createForClass(Sell);
