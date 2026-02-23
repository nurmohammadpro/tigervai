// src/product/dto/create-product.dto.ts
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ProductImageDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty()
  @IsString()
  key: string;

  @ApiProperty()
  @IsString()
  id: string;
}

class ProductCategoryDto {
  @ApiProperty()
  @IsString()
  main: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subMain?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  semiSub?: string;

  @ApiProperty()
  @IsString()
  category: string;
}

class FeatureDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

class BrandInfoDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;
}

// ✅ NEW VARIANT DTO
class ProductVariantDto {
  @ApiProperty({ description: 'Variant size (e.g., S, M, L, XL)' })
  @IsString()
  size: string;

  @ApiProperty({
    description: 'Variant color (optional for tyres)',
    required: false,
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ description: 'Variant specific price' })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Variant stock quantity', required: false })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  stock?: number;

  @ApiProperty({ description: 'Variant stock quantity', required: false })
  @IsOptional()
  @IsString()
  recommended?: number;

  @ApiProperty({ description: 'Variant discount price', required: false })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  discountPrice?: number;

  @ApiProperty({ type: ProductImageDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductImageDto)
  image?: ProductImageDto;

  @ApiProperty({ description: 'SKU code', required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ description: 'Is variant available', required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isAvailable?: boolean;
}

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Average price (auto-calculated from variants if provided)',
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Total stock (auto-calculated from variants if provided)',
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  stock: number;

  // ✅ NEW VARIANTS ARRAY
  @ApiProperty({
    type: [ProductVariantDto],
    required: false,
    description: 'Product variants (size, color, price)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  variants?: ProductVariantDto[];

  @ApiProperty({ type: [FeatureDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  features: FeatureDto[];

  @ApiProperty({ type: ProductImageDto })
  @ValidateNested()
  @Type(() => ProductImageDto)
  thumbnail: ProductImageDto;

  @ApiProperty({ type: [ProductImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDto)
  images: ProductImageDto[];

  @ApiProperty({ type: ProductCategoryDto })
  @ValidateNested()
  @Type(() => ProductCategoryDto)
  category: ProductCategoryDto;

  @ApiProperty({ type: BrandInfoDto })
  @ValidateNested()
  @Type(() => BrandInfoDto)
  brand: BrandInfoDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  main?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subMain?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  semiSub?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  height?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  width?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  weight?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  colors?: string[];

  /*   @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  metaDescription?: string; */

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  warrantyPeriod?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  returnPolicy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isDigital?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hasOffer?: boolean;

  @ApiProperty({
    description:
      'Average offer price (auto-calculated from variants if provided)',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  offerPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  offerExpiresAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  specifications?: Record<string, string>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shippingTime?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shortDescription?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  special_offer?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  company_details?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  shippingCost?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  freeShipping?: boolean;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  certifications?: string[];

  @ApiProperty({ type: Boolean })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  @IsBoolean()
  isAdminCreated: boolean;

  @ApiProperty({
    enum: ['tyre', 'clothing', 'electronics', 'accessories'],
    default: 'clothing',
    description: 'Product type for variant selection behavior',
  })
  @IsString()
  productType: string = 'clothing';
}

export class GetProductDTo {
  @ApiProperty({ required: false })
  @IsString()
  slug: string;
}

export class getProductCsv {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  main: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  subMain: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  category: string;
}
