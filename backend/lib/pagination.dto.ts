
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsEnum, IsMongoId } from 'class-validator';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationDto {
  @ApiPropertyOptional({ example: 1 })@Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'createdAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ enum: SortOrder, example: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

@ApiPropertyOptional({ example:"mongo-db id" })
 
  @IsOptional()

  @IsMongoId()
  id?: string ;
@ApiPropertyOptional({ example:"slug" })
 
  @IsOptional()
  @IsString()
 
  slug?: string ;
}

export class DeleteDto{
    @ApiPropertyOptional({ example:"mongo-db id" })
 
  @IsOptional()

  @IsMongoId()
  id?: string ;
@ApiPropertyOptional({ example:"slug" })
 
  @IsOptional()
  @IsString()
 
  slug?: string ;
}


