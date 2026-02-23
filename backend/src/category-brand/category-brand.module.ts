import { Module } from '@nestjs/common';
import { CategoryBrandService } from './category-brand.service';
import { CategoryBrandController } from './category-brand.controller';

@Module({
  controllers: [CategoryBrandController],
  providers: [CategoryBrandService],
})
export class CategoryBrandModule {}
