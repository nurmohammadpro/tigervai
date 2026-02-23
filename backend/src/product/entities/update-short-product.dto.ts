// src/product/dto/update-short-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateShortProductDto {
  @ApiProperty({ required: false })
  @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  hotDeals?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  hotOffer?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  productOfTheDay?: boolean;
}
