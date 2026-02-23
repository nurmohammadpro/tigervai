
import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, Min } from 'class-validator';
export class CreateCartDto {
    @ApiProperty({ description: 'Product ID' })
  @IsMongoId()
  productId: string;

  @ApiProperty({ description: 'Product quantity', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}
export class RemoveFromCartDto {
  @ApiProperty({ description: 'Product ID to remove' })
  @IsMongoId()
  productId: string;
}