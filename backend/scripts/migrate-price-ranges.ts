/**
 * Migration script to update price range fields for existing products
 * Run this script once to populate minPrice, maxPrice, minOriginalPrice, maxOriginalPrice
 *
 * Usage: npm run migrate:price-ranges
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { Product, ProductSchema } from '../src/product/entities/product.entity';
import { ShortProduct, ShortProductSchema } from '../src/product/entities/short-product.schema';
import { ProductHelper } from '../lib/product.helper';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'tiger-vai';

async function migrate() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URL);
    console.log('✅ Connected successfully!\n');

    // Get the database
    const db = mongoose.connection.useDb(DB_NAME);

    // Create models
    const ProductModel = db.model('Product', ProductSchema);
    const ShortProductModel = db.model('ShortProduct', ShortProductSchema);

    console.log('=== MIGRATING SHORT PRODUCTS ===\n');

    // Find all short products
    const shortProducts = await ShortProductModel.find({}).lean();
    console.log(`📊 Found ${shortProducts.length} products in database\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const product of shortProducts as any[]) {
      // Check if price range fields are already populated with valid values
      const hasValidPriceRange =
        product.minPrice !== undefined &&
        product.maxPrice !== undefined &&
        product.minOriginalPrice !== undefined &&
        product.maxOriginalPrice !== undefined &&
        product.minPrice > 0 &&
        product.maxPrice > 0;

      if (hasValidPriceRange) {
        skippedCount++;
        console.log(`⏭️  Skipped ${product.name} (already has price ranges: ৳${product.minPrice} - ৳${product.maxPrice})`);
        continue;
      }

      // Calculate price range from variants
      const priceRange = ProductHelper.calculatePriceRange(
        product.variants || [],
        product.price,
        product.offerPrice,
        product.hasOffer
      );

      await ShortProductModel.findByIdAndUpdate(product._id, {
        minPrice: priceRange.minPrice,
        maxPrice: priceRange.maxPrice,
        minOriginalPrice: priceRange.minOriginalPrice,
        maxOriginalPrice: priceRange.maxOriginalPrice,
      });

      console.log(`✏️  Updated ${product.name}:`);
      console.log(`   Price range: ৳${priceRange.minPrice.toLocaleString()} - ৳${priceRange.maxPrice.toLocaleString()}`);
      if (priceRange.hasDiscount) {
        console.log(`   Original range: ৳${priceRange.minOriginalPrice.toLocaleString()} - ৳${priceRange.maxOriginalPrice.toLocaleString()}`);
      }
      updatedCount++;
    }

    console.log(`\n✅ Short Products: ${updatedCount} updated, ${skippedCount} skipped (already have price ranges)`);

    console.log('\n=== UPDATING MEILISEARCH INDEX ===\n');
    console.log('⚠️  Note: You may need to manually reindex Meilisearch if search results show incorrect prices.');
    console.log('   This can be done by deleting and recreating the index, or by updating each product individually.');

    await mongoose.disconnect();
    console.log('\n✅ Migration complete!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

migrate();
