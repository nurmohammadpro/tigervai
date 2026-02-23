

import { IsOptional, IsString, IsBoolean, IsNumberString, IsIn, IsNumber, isBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchProductsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  q?: string;

     @ApiPropertyOptional()
  @IsOptional()
  @IsString()

  @ApiPropertyOptional()
  category?: string;


    @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subMain?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brandName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  main?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  hasOffer?: boolean;

    @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortBy?: 'createdAt' | 'price' | 'stock' | 'rating';

    @ApiPropertyOptional()
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

    @ApiPropertyOptional()
  @IsOptional()
 
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit?: number;

     @ApiPropertyOptional()
  @IsOptional()
 
  @Transform(({ value }) => parseInt(value))
    @IsNumber()
  page?: number;
      @ApiPropertyOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
  @IsOptional()

  minPrice?: number;
      @ApiPropertyOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
  @IsOptional()

  maxPrice?: number;
      @ApiPropertyOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
  @IsOptional()

  minRating?: number;
      @ApiPropertyOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
  @IsOptional()

  maxRating?: number;
}

export class CreateMeilisearchDto {
     @IsString()
  id: string; // must match your Mongo _id as string

  @IsString()
  name: string;

   @IsString()
  thumbnail: string;

   @IsString()
  slug: string;


  @IsNumber()
  @IsOptional()
    offerPrice?: number;

   @IsBoolean()
  @IsOptional()
 isDigital?: boolean;

   @IsBoolean()
  @IsOptional()
 isAdminCreated?: boolean;

  @IsOptional()
  @IsString()
  category?: string;
  @IsOptional()
  @IsString()
  subMain?: string;

  @IsOptional()
  @IsString()
  brandName?: string;

  @IsOptional()
  @IsString()
  main?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsNumber()
  rating?: number;

   @IsOptional()
  @IsString()
  brandId?: string;

  @IsOptional()
  @IsBoolean()
  hasOffer?: boolean;

  @IsOptional()
  @IsString()
  createdAt?: string; // store as ISO string for sorting
}
