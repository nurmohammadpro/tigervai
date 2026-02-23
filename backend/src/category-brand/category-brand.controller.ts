import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Param,
  Body,
  Query,
} from '@nestjs/common';

import { CategoryBrandService } from './category-brand.service';

import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateBrandDto,
  UpdateBrandDto,
  PaginationDto,
} from './dto/create-category-brand.dto';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Category & Brand')
@Controller()
export class CategoryBrandController {
  constructor(private readonly service: CategoryBrandService) {}

  // ✅ CATEGORY
  @Post('category')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.service.createCategory(dto);
  }

  @Patch('category/:id')
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.service.updateCategory(id, dto);
  }

  @Delete('category/:id')
  deleteCategory(@Param('id') id: string) {
    return this.service.deleteCategory(id);
  }

  @Get('category')
  getCategories(@Query() pagination: PaginationDto) {
    return this.service.getCategories(pagination);
  }
  @Get('get-top-category')
  getTopCategory() {
    return this.service.getTopCategory();
  }
   @Get('brand')
  getBrands(@Query() pagination: PaginationDto) {
    return this.service.getBrands(pagination);
  }
    @Get('get-top-brand')
  getTopBrand() {
    return this.service.getTopBrand();
  }

  // ✅ BRAND
  @Post('brand')
  createBrand(@Body() dto: CreateBrandDto) {
    return this.service.createBrand(dto);
  }

  @Patch('brand/:id')
  updateBrand(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.service.updateBrand(id, dto);
  }

  @Delete('brand/:id')
  deleteBrand(@Param('id') id: string) {
    return this.service.deleteBrand(id);
  }

 

}
