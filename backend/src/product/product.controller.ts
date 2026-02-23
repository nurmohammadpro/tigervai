import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Get,
  Query,
  UseGuards,
  Res,
  StreamableFile,
  Header,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, getProductCsv, GetProductDTo } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateShortProductDto } from './entities/update-short-product.dto';
import { SearchProductDto } from './entities/search-product.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review.dto';
import { UserRole } from 'src/user/entities/user.schema';
import { AuthGuard, type ExpressRequest } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { DeleteDto, PaginationDto } from 'lib/pagination.dto';
import { format } from "fast-csv";
import { type Response } from 'express';
@ApiTags('Products')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // ✅ Admin or Vendor create product
  @Post('create')
  @ApiOperation({ summary: 'Create a new product (Admin or Vendor)' })
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  async create(@Body() dto: CreateProductDto, @Req() req: ExpressRequest) {
    return this.productService.createProduct(dto, req?.user?.id, req?.user?.role as UserRole);
  }

  // ✅ Admin update product
  @Patch('admin-update/:id')
  @ApiOperation({ summary: 'Update a product as Admin' })
  async adminUpdate(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.adminUpdateProduct(id, dto);
  }

  // ✅ Vendor update product (self-owned)
  @Patch('vendor-update/:id')
  @ApiOperation({ summary: 'Update a product as Vendor (self-owned)' })
  async vendorUpdate(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Req() req,
  ) {
    return this.productService.vendorUpdateProduct(id, req.user.id, dto);
  }

  // ✅ Delete product (Admin only)
  @Delete()
   @UseGuards(AuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  @ApiOperation({ summary: 'Delete a product (Admin only)' })
  async delete(@Query() query: DeleteDto, @Req()  req: ExpressRequest) {
    return this.productService.deleteProduct(query?.id!, req?.user?.role as UserRole);
  }

  // ✅ Create Review
  @Post('review')
  @ApiOperation({ summary: 'Add a review to a product' })
  @UseGuards(AuthGuard)
  async createReview(@Body() dto: CreateReviewDto,@Req() req:ExpressRequest) {
    return this.productService.createReview(dto,req.user.id);
  }

  // ✅ Update ShortProduct Flags (hotDeals, hotOffer, productOfTheDay)
  @Patch('update-flags/:slug')
  @ApiOperation({ summary: 'Update short product flags' })
  async updateShortProductFlags(
    @Param('slug') slug: string,
    @Body() dto: UpdateShortProductDto,
  ) {
    return this.productService.updateShortProductFlags(slug, dto);
  }

  // ✅ Search Products with filters & pagination (ShortProduct)
  @Get('search')
  @ApiOperation({ summary: 'Search products with filters and pagination' })
  async searchProducts(@Query() query: SearchProductDto) {
    return this.productService.searchProducts(query);
  }
  @Get('getProductVendorAdmin')
  @ApiOperation({ summary: 'Search products with filters and pagination' })
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.VENDOR)
  async getProductAdminVendor(@Query() query: SearchProductDto, @Req() req: ExpressRequest) {
    return this.productService.getProductAdminVendor(query,req?.user);
  }


  @Get('getAllProductsAdmin')
  @ApiOperation({ summary: 'Search products with filters and pagination' })
  @UseGuards(AuthGuard,RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllProducts(@Query() query: SearchProductDto) {
    return this.productService.getAllProducts(query);
  }
  @Get('get-product')
  @ApiOperation({ summary: 'Search products with filters and pagination' })
  async getOneProduct(@Query() query: GetProductDTo) {
    return this.productService.getProduct(query.slug);
  }
  @Get('get-all-reviews-for-products')
  @ApiOperation({ summary: 'Search products with filters and pagination' })
  async getAllReviews(@Query() query: PaginationDto) {
    return this.productService.getAllReviews(query);
  }




  @Get('get-product-csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename=data.csv')

async getProductForCsv(@Query() query: getProductCsv, @Res() res: Response) {
  const cursor = await this.productService.getProductInCSV(query);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=data.csv');

  const csvStream = format({ headers: true });
  
  // Pipe CSV stream output into HTTP response stream
  csvStream.pipe(res);

  cursor.on('data', (doc) => {
    const metaProduct = this.productService.convertToMetaProduct(doc);
    csvStream.write(metaProduct);
  });

  cursor.on('end', () => {
    csvStream.end();
  });

  cursor.on('error', (err) => {
    console.error('Cursor stream error:', err);
    res.status(500).end('Error streaming CSV');
  });

  
}

}
