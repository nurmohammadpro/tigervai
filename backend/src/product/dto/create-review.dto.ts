// src/review/dto/create-review.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, Max, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ description: 'User ID who writes the review' })
  @IsString()
 @IsOptional()
  userId: string;

  @ApiProperty({ description: 'Name of the user' })
  @IsString()
   @IsOptional()
  userName: string;

  @ApiProperty({ description: 'Product ID being reviewed' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Review comment' })
  @IsString()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({
    description: 'Rating value (1–5)',
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
