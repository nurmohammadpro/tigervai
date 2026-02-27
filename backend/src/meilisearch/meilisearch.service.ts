import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateMeilisearchDto, SearchProductsDto } from './dto/create-meilisearch.dto';
import { UpdateMeilisearchDto } from './dto/update-meilisearch.dto';
import { Index, MeiliSearch } from 'meilisearch';
import { TenantConnectionService } from 'lib/connection/mongooseConnection.service';
import { ShortProduct, ShortProductSchema } from 'src/product/entities/short-product.schema';
import { globalProducts } from 'lib/global-db/globaldb';
@Injectable()
export class MeilisearchService implements OnModuleInit{
    private readonly logger = new Logger(MeilisearchService.name);
  private client: MeiliSearch;
  private index:Index<CreateMeilisearchDto>;

  constructor(private tenant: TenantConnectionService) {}

  async onModuleInit() {
    try{
      this.client = new MeiliSearch({
      host: process.env.MELISEACH_URL as string,
      apiKey: process.env.MELISEACH_TOKEN as string,
    });
    this.client.createIndex('short_products',{
      primaryKey: 'id',
    });
     this.index = this.client.index<CreateMeilisearchDto>('short_products');
     const h =  await this.client.health();

    await this.setupIndex();
     this.logger.log('✅ MeiliSearch connected successfully',h.status);

    }catch(error){
      this.logger.error('❌ Could not connect to MeiliSearch', error);

    }

  }

  private shortProductModel() {
    return this.tenant.getModel<any>(
      globalProducts,
      ShortProduct.name,
      ShortProductSchema,
    );
  }

  private async setupIndex() {
    await this.index.updateFilterableAttributes([
      'category',
      'subMain',
      'brandName',
      'main',
      'hasOffer',
      'price',
      'stock',
      'rating',
    ]);

    await this.index.updateSortableAttributes([
      'createdAt',
      'price',
      'stock',
      'rating',
    ]);
  }

  /** 🟢 Create document */
  async create(doc: CreateMeilisearchDto) {
    this.logger.log('🟢 Creating document', doc);
      if (!doc.id) {
    throw new Error('Document must have an id field');
  }
   const task = await this.index.addDocuments([doc],{primaryKey:"id"});
   this.logger.log('🟢 Document created', task);
  
  return task;
  }

  /** 🟡 Update document */
  async update(id: string, updatedData: UpdateMeilisearchDto) {
    return await this.index.updateDocuments([{ id, ...updatedData }]);
  }
  async updateProduct(updatedData: UpdateMeilisearchDto) {
  // updatedData MUST include the 'id' field
  if (!updatedData.id) {
    throw new Error('Document must have an id field for update');
  }
  
  this.logger.log('🟡 Updating document', updatedData.id);
  const task = await this.index.updateDocuments([updatedData]);
  this.logger.log('🟡 Document updated', task);
  
  return task;
}

  /** 🔴 Delete document */
  async delete(id: string) {
    return this.index.deleteDocument(id);
  }

  /** 🔍 Search documents with DTO - Using MongoDB directly */
  async search(dto: SearchProductsDto) {
  const {
    q = '',
    category,
    brandName,
    main,
    subMain,
    hasOffer,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    limit = 20,
    page = 1,
    minPrice,
    maxPrice,
    minRating,
    maxRating,
  } = dto;

  const ShortProductModel = this.shortProductModel();

  // Build MongoDB query
  const filter: any = { isActive: true };

  // Text search
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { brandName: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
      { main: { $regex: q, $options: 'i' } },
      { subMain: { $regex: q, $options: 'i' } },
    ];
  }

  // Filter by category
  if (category) filter.category = category;
  if (brandName) filter.brandName = brandName;
  if (main) filter.main = main;
  if (subMain) filter.subMain = subMain;
  if (hasOffer !== undefined) filter.hasOffer = hasOffer;

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  // Rating range filter
  if (minRating !== undefined || maxRating !== undefined) {
    filter.rating = {};
    if (minRating !== undefined) filter.rating.$gte = minRating;
    if (maxRating !== undefined) filter.rating.$lte = maxRating;
  }

  // Calculate skip for pagination
  const skip = (page - 1) * limit;

  // Build sort object
  const sortObj: any = {};
  if (sortBy) {
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }

  // Execute queries in parallel
  const [total, products] = await Promise.all([
    ShortProductModel.countDocuments(filter),
    ShortProductModel
      .find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean()
  ]);

  // Build facets from the results
  const facets: any = {
    category: {},
    brandName: {},
    main: {},
    hasOffer: {},
    rating: {},
  };

  // Aggregate facet counts from current page results
  products.forEach((product: any) => {
    facets.category[product.category] = (facets.category[product.category] || 0) + 1;
    facets.brandName[product.brandName] = (facets.brandName[product.brandName] || 0) + 1;
    facets.main[product.main] = (facets.main[product.main] || 0) + 1;
    facets.hasOffer[product.hasOffer ? 'true' : 'false'] = (facets.hasOffer[product.hasOffer ? 'true' : 'false'] || 0) + 1;

    const ratingRange = Math.floor(product.rating || 0);
    facets.rating[ratingRange.toString()] = (facets.rating[ratingRange.toString()] || 0) + 1;
  });

  // Format products for response
  const items = products.map((product: any) => ({
    id: product._id.toString(),
    name: product.name,
    thumbnail: product.thumbnail,
    main: product.main,
    category: product.category,
    subMain: product.subMain,
    price: product.price ?? 0,
    offerPrice: product.offerPrice,
    hasOffer: product.hasOffer,
    isDigital: product.isDigital,
    brandId: product.brandId,
    brandName: product.brandName,
    slug: product.slug,
    isAdminCreated: product.isAdminCreated,
    stock: product.stock ?? 0,
    rating: product.rating || 0,
    createdAt: product.createdAt?.toString() || Date.now().toString(),
    // ✅ Add price range fields for consistent display
    minPrice: product.minPrice ?? product.offerPrice ?? product.price ?? 0,
    maxPrice: product.maxPrice ?? product.offerPrice ?? product.price ?? 0,
    minOriginalPrice: product.minOriginalPrice ?? product.price ?? 0,
    maxOriginalPrice: product.maxOriginalPrice ?? product.price ?? 0,
  }));

  // Calculate total pages
  const totalPages = Math.ceil(total / limit);

  return {
    total,
    items,
    facets,
    pagination: {
      currentPage: page,
      pageSize: limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

  async findAll() {
    return this.index.getDocuments();
  }
}
