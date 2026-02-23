// src/product/dto/search-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SearchProductDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string; // text search for name, brand, category

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  main?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brandName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean() 
  hasOffer?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isDigital?: boolean;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiProperty({ required: false, default: 'desc' })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @ApiProperty()
  @IsOptional()
  @IsString()
  sortBy?: string;
}
