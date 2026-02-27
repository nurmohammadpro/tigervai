/**
 * Script to sync a single product from MongoDB to Meilisearch
 * This fixes price mismatch issues between the database and search index
 *
 * Usage: node scripts/sync-product-to-meilisearch.js <productId>
 * Example: node scripts/sync-product-to-meilisearch.js 6796e3abc123
 */

const mongoose = require('mongoose');

// Configuration - update these to match your environment
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tiger-vai';
const MEILISEARCH_URL = process.env.MEILISEACH_URL || 'http://localhost:7700';
const MEILISEARCH_API_KEY = process.env.MEILISEACH_TOKEN || '';

async function syncProduct(productId) {
  console.log('🔍 Starting product sync...');

  // Connect to MongoDB
  console.log('📦 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Connect to Meilisearch
  const { MeiliSearch } = require('meilisearch');
  const meilisearch = new MeiliSearch({
    host: MEILISEARCH_URL,
    apiKey: MEILISEARCH_API_KEY,
  });
  console.log('✅ Connected to Meilisearch');

  // Get the ShortProduct collection
  const ShortProductSchema = new mongoose.Schema({}, { strict: false });
  const ShortProduct = mongoose.model('ShortProduct', ShortProductSchema, 'shortproducts');

  // Find the product by slug or _id
  let product = await ShortProduct.findById(productId);

  if (!product) {
    // Try to find by slug
    product = await ShortProduct.findOne({ slug: productId });
  }

  if (!product) {
    console.error(`❌ Product not found with ID/slug: ${productId}`);
    process.exit(1);
  }

  console.log(`📦 Found product: ${product.name}`);
  console.log(`   - Price: ${product.price}`);
  console.log(`   - Offer Price: ${product.offerPrice}`);
  console.log(`   - Has Offer: ${product.hasOffer}`);

  // Convert to Meilisearch format
  const miliProduct = {
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
    id: product._id.toString(),
    rating: product.rating || 0,
    createdAt: product.createdAt?.toString() || Date.now().toString(),
  };

  console.log('\n🔄 Syncing to Meilisearch...');
  console.log(`   - Price: ${miliProduct.price}`);
  console.log(`   - Offer Price: ${miliProduct.offerPrice}`);

  // Update Meilisearch
  const index = meilisearch.index('short_products');
  const task = await index.updateDocuments([miliProduct]);

  console.log('\n✅ Product synced successfully!');
  console.log(`   Task ID: ${task.taskUid}`);
  console.log('\n⏳ Please wait a moment for Meilisearch to process the update, then refresh your search page.');

  await mongoose.disconnect();
  process.exit(0);
}

// Get product ID from command line
const productId = process.argv[2];

if (!productId) {
  console.error('❌ Please provide a product ID or slug');
  console.log('Usage: node scripts/sync-product-to-meilisearch.js <productId>');
  process.exit(1);
}

syncProduct(productId).catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
