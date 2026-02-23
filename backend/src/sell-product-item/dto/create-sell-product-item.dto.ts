// src/sell/dto/create-sell.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod } from '../entities/sell-product-item.entity';


// ✅ NEW: Variant DTO for orders
class OrderProductVariantDto {
  @ApiProperty({ description: 'Variant size' })
  @IsString()
  size: string;

  @ApiProperty({ description: 'Variant color' })
  @IsString()
  color: string;

  @ApiPropertyOptional({ description: 'SKU code' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ description: 'Variant price at time of order' })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ description: 'Discount price if applicable' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  discountPrice?: number;
}

class SellProductItemDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsString()
  slug: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  quantity: number;

  // ✅ NEW: Variant info required
  @ApiProperty({ type: OrderProductVariantDto })
  @ValidateNested()
  @Type(() => OrderProductVariantDto)
  variant: OrderProductVariantDto;

  @ApiPropertyOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  totalPrice: number;

  @ApiProperty({ description: 'Unit price at time of order' })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  unitPrice: number;

  @ApiPropertyOptional({ description: 'Discount applied to this item' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  discountApplied?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brandName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brandId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mainCategory?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vendorId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  vendorSlug?: string;
}

class ShipmentDetailsDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  house: string;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  thana?: string;
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  district?: string;
}

export class CreateSellProductItemDto {
  @ApiProperty({ type: [SellProductItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SellProductItemDto)
  products: SellProductItemDto[];

  @ApiProperty({ type: ShipmentDetailsDto })
  @ValidateNested()
  @Type(() => ShipmentDetailsDto)
  shipment: ShipmentDetailsDto;

  @ApiProperty()
  @IsString()
  @IsOptional()
  userId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  isAdmin: boolean;

  @ApiProperty({ description: 'Total order amount' })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  orderTotal: number;

  @ApiPropertyOptional({ description: 'Total discount/coupon applied' })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  totalDiscount?: number;
}

export class GetOrdersDto {
  @ApiPropertyOptional({ description: 'Page number for pagination', default: 1 })
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of items per page', default: 10 })
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Sort order: asc or desc',
    default: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({
    description: 'Field to sort by',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';
  
  @ApiPropertyOptional({
    description: 'Field to sort by',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  orderStatus?: string ;
  @ApiPropertyOptional({
    description: 'Field to sort by',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString()
  search?: string ;
}



//  {
//   "products": [
//     {
//       "productId": "prod_123",
//       "slug": "t-shirt",
//       "name": "T-Shirt",
//       "quantity": 2,
//       "variant": {
//         "size": "M",
//         "color": "Red",
//         "price": 500,           // ORIGINAL PRICE
//         "discountPrice": 450    // DISCOUNT (optional)
//       },
//       "unitPrice": 450,         // ✅ USE discountPrice if exists, else price
//       "totalPrice": 900,        // ✅ unitPrice × quantity = 450 × 2
//       "discountApplied": 100,   // ✅ (500 - 450) × 2 = 100
//       // ... other fields
//     }
//   ],
//   "shipment": { /* ... */ },
//   "userId": "user_123",
//   "orderTotal": 900,            // ✅ SUM of all totalPrice
//   "totalDiscount": 100          // ✅ SUM of all discountApplied
// } 


export enum SellsType {
  TODAY = 'TODAY',
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  THIS_YEAR = 'THIS_YEAR',
  CUSTOM = 'CUSTOM',
}

export class MySellsDto {
  @ApiPropertyOptional({ default: SellsType.TODAY, enum: SellsType })
  @IsEnum(SellsType)
  @IsOptional()
  type?: SellsType;

  @ApiPropertyOptional({ example: '2025-12-01' })
  @IsDateString()
  @IsOptional()
  fromDate?: string;

  @ApiPropertyOptional({ example: '2025-12-15' })
  @IsDateString()
  @IsOptional()
  toDate?: string;


  @ApiProperty()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  isAdmin: boolean

}

