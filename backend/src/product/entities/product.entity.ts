// src/product/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema,Types } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;
export type ProductStatsDocument = HydratedDocument<ProductStats>;

@Schema()
class ProductImage {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  id: string;
}

@Schema({ _id: false })
class ProductCategory {
  @Prop({ required: true })
  main: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  subMain: string;
}

@Schema()
export class ProductStats {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', unique: true })
  productId: string;

  @Prop({ default: 0 })
  soldCount: number;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  userId: MongooseSchema.Types.ObjectId;
}

@Schema({ _id: false })
class ColorImage {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], default: [] })
  images: string[];
}

@Schema({ _id: false })
class Feature {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
}

@Schema({ _id: false })
class BrandInfo {
  @Prop()
  id: string;

  @Prop({ required: true })
  name: string;
}

// ✅ NEW VARIANT SCHEMA
@Schema({ _id: false })
class ProductVariant {
  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  color: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 0 })
  stock: number;

  @Prop()
  discountPrice?: number;

  @Prop({ type: ProductImage })
  image?: ProductImage;

  @Prop()
  sku?: string;
  @Prop()
  recommended?: string;

  @Prop({ default: true })
  isAvailable: boolean;
}

@Schema({ timestamps: true, autoIndex: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  // ✅ CHANGED: Now average price
  @Prop({ required: true })
  price: number; // Average price from variants

  // ✅ CHANGED: Now average stock
  @Prop({ default: 0 })
  stock: number; // Total stock from all variants

  // ✅ NEW: Variants array
  @Prop({ type: [ProductVariant], default: [] })
  variants: ProductVariant[];

  @Prop({ type: [ColorImage], default: [] })
  colorsImage: ColorImage[];

  @Prop({ type: [Feature], default: [] })
  features: Feature[];

  @Prop({ type: ProductImage, required: true })
  thumbnail: ProductImage;

  @Prop({ type: [ProductImage], default: [] })
  images: ProductImage[];

  @Prop({ type: ProductCategory, required: true })
  category: ProductCategory;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ unique: true, index: true })
  slug: string;

  @Prop()
  height: number;

  @Prop()
  width: number;

  @Prop()
  weight: string;

  @Prop()
  size: string;

  @Prop({ type: [String], default: [] })
  colors: string[];

  @Prop()
  warrantyPeriod: string;

  @Prop()
  returnPolicy: string;

  @Prop({ default: false })
  isDigital: boolean;

  @Prop({ type: BrandInfo, required: true })
  brand: BrandInfo;

  @Prop({ default: false })
  hasOffer: boolean;

  // ✅ CHANGED: Now average offer price
  @Prop()
  offerPrice: number; // Average offer price from variants

  @Prop()
  offerExpiresAt: Date;

  @Prop({ type: Map, of: String })
  specifications: Map<string, string>;

  @Prop()
  shippingTime: string;

  @Prop()
  shippingCost: number;

  @Prop({ default: false })
  freeShipping: boolean;

  @Prop({ type: [String], default: [] })
  certifications: string[];

  @Prop({ type: Types.ObjectId })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  updatedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId })
  stats: Types.ObjectId;

  @Prop({ default: false })
  isAdminCreated: boolean;
  @Prop()
  shortDescription: string;
  @Prop()
  special_offer: string;
  @Prop()
  company_details: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export const ProductStatsSchema = SchemaFactory.createForClass(ProductStats);
