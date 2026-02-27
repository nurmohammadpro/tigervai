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

  /** 🔍 Search documents with DTO */
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
    page = 1,  // ✅ Add page parameter (default: 1)
    minPrice,
    maxPrice,
    minRating,   // ✅ new
    maxRating,
  } = dto;

  // ✅ Calculate offset based on page number
  const offset = (page - 1) * limit;

  const filters: string[] = [];

  if (category) filters.push(`category = "${category}"`);
  if (brandName) filters.push(`brandName = "${brandName}"`);
  if (subMain) filters.push(`subMain = "${subMain}"`);
  if (main) filters.push(`main = "${main}"`);
  if (hasOffer !== undefined) filters.push(`hasOffer = ${hasOffer}`);

  // ✅ Add price range filter
  if (minPrice !== undefined) filters.push(`price >= ${minPrice}`);
  if (maxPrice !== undefined) filters.push(`price <= ${maxPrice}`);

    // ✅ Rating range filter
  if (minRating !== undefined) filters.push(`rating >= ${minRating}`);
  if (maxRating !== undefined) filters.push(`rating <= ${maxRating}`);
  const filterStr = filters.length ? filters.join(' AND ') : undefined;

  // Step 1: Search Meilisearch to get matching product IDs
  const result = await this.index.search(q, {
    filter: filterStr,
    limit,
    offset,  // ✅ Add offset for pagination
    sort: sortBy ? [`${sortBy}:${sortOrder}`] : undefined,
    facets: ['category', 'brandName', 'main', 'hasOffer',"rating"],
  });

  // Step 2: Extract product IDs from Meilisearch results
  const productIds = result.hits.map((hit: any) => hit.id);

  // Step 3: Fetch fresh data from MongoDB using the IDs
  const ShortProductModel = this.shortProductModel();
  const mongoProducts = await ShortProductModel.find({
    _id: { $in: productIds },
    isActive: true
  }).lean();

  // Step 4: Create a map of MongoDB products by ID for quick lookup
  const productMap = new Map(
    mongoProducts.map((p: any) => [p._id.toString(), p])
  );

  // Step 5: Replace Meilisearch hits with fresh MongoDB data, maintaining the sort order
  const items = result.hits.map((hit: any) => {
    const freshProduct = productMap.get(hit.id);
    if (freshProduct) {
      // Return fresh MongoDB data with Meilisearch metadata
      return {
        id: freshProduct._id.toString(),
        name: freshProduct.name,
        thumbnail: freshProduct.thumbnail,
        main: freshProduct.main,
        category: freshProduct.category,
        subMain: freshProduct.subMain,
        price: freshProduct.price ?? 0,
        offerPrice: freshProduct.offerPrice,
        hasOffer: freshProduct.hasOffer,
        isDigital: freshProduct.isDigital,
        brandId: freshProduct.brandId,
        brandName: freshProduct.brandName,
        slug: freshProduct.slug,
        isAdminCreated: freshProduct.isAdminCreated,
        stock: freshProduct.stock ?? 0,
        rating: freshProduct.rating || 0,
        createdAt: freshProduct.createdAt?.toString() || Date.now().toString(),
      };
    }
    return hit; // Fallback to Meilisearch data if not found in MongoDB
  });

  // ✅ Calculate total pages
  const totalPages = Math.ceil(result.estimatedTotalHits / limit);

  return {
    total: result.estimatedTotalHits,
    items,
    facets: result.facetDistribution || {},
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
