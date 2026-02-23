import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Category,
  CategoryDocument,
  CategorySchema
} from './entities/category-brand.entity';

import {
  Brand,
  BrandDocument,
  BrandSchema
} from './entities/category-brand.entity';

import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateBrandDto,
  UpdateBrandDto,
  PaginationDto,
} from './dto/create-category-brand.dto';
import { TenantConnectionService } from 'lib/connection/mongooseConnection.service';
import { globalOther } from 'lib/global-db/globaldb';

@Injectable()
export class CategoryBrandService {
  constructor(private tenant: TenantConnectionService) {}
  private getCategoryModel() {
    return this.tenant.getModel<CategoryDocument>(globalOther,Category.name, CategorySchema);
  }
  private getBrandModel() {
    return this.tenant.getModel<BrandDocument>(globalOther,Brand.name, BrandSchema);
  }

  // ✅ CATEGORY CRUD
  async createCategory(dto: CreateCategoryDto) {
    const createModel = await this.getCategoryModel()
    return await createModel.create(dto);
  }

  async updateCategory(id: string, dto: UpdateCategoryDto) {
     const createModel = await this.getCategoryModel()
    const category = await createModel.findByIdAndUpdate(id, dto, { new: true });
    if (!category) throw new HttpException('Category not found', 404);
    return category;
  }

  async deleteCategory(id: string) {
      const createModel = await this.getCategoryModel()
    const deleted = await createModel.findByIdAndDelete(id);
    if (!deleted) throw new HttpException('Category not found', 404);
    return { message: 'Category deleted successfully' };
  }

  async getCategories({ page = 1, limit = 10 }: PaginationDto) {
    const categoryModel = await this.getCategoryModel()
    const skip = (page - 1) * limit;

    const total = await categoryModel.countDocuments();
    const data = await categoryModel.find().skip(skip).limit(limit).lean();

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }
  async getTopCategory() {
    const categoryModel = await this.getCategoryModel()
 


    const data = await categoryModel.find({isTop:true}).lean();

    return data;
  }

  // ✅ BRAND CRUD
  async createBrand(dto: CreateBrandDto) {
    const categoryModel = await this.getBrandModel()
    return categoryModel.create(dto);
  }

  async updateBrand(id: string, dto: UpdateBrandDto) {
    const categoryModel = await this.getBrandModel()
    const brand = await categoryModel.findByIdAndUpdate(id, dto, { new: true });
    if (!brand) throw new HttpException('Brand not found', 404);
    return brand;
  }

  async deleteBrand(id: string) {
     const categoryModel = await this.getBrandModel()
    const deleted = await categoryModel.findByIdAndDelete(id);
    if (!deleted) throw new HttpException('Brand not found', 404);
    return { message: 'Brand deleted successfully' };
  }

  async getBrands({ page = 1, limit = 10 }: PaginationDto) {
    const categoryModel = await this.getBrandModel()
    const skip = (page - 1) * limit;

    const total = await categoryModel.countDocuments();
    const data = await categoryModel.find().skip(skip).limit(limit).lean();

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }
  async getTopBrand() {
    const categoryModel = await this.getBrandModel()
   

 
    const data = await categoryModel.find({isTop:true}).lean();

    return data;
  }
}
