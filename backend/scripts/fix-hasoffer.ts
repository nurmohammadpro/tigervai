/**
 * Migration script to fix hasOffer field for existing products
 * Run this script once to update all products with incorrect hasOffer values
 *
 * Usage: npm run migrate:fix-hasoffer
 */

import mongoose from 'mongoose';
import { Product, ProductSchema } from '../src/product/entities/product.entity';
import { ShortProduct, ShortProductSchema } from '../src/product/entities/short-product.schema';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const DB_NAME = 'tiger-vai-products';

/**
 * Calculate hasOffer based on price and offerPrice
 */
function calculateHasOffer(price: number, offerPrice?: number): boolean {
  if (!offerPrice || offerPrice <= 0) return false;
  if (!price || price <= 0) return false;
  return offerPrice < price;
}

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

    console.log('=== MIGRATING FULL PRODUCTS ===\n');

    // Find all products that need to be fixed
    const productsToFix = await ProductModel.find({}).lean();

    let fixedCount = 0;
    let alreadyCorrect = 0;

    for (const product of productsToFix) {
      const correctHasOffer = calculateHasOffer(product.price, product.offerPrice);

      if (product.hasOffer !== correctHasOffer) {
        await ProductModel.findByIdAndUpdate(product._id, { hasOffer: correctHasOffer });
        console.log(`✏️  Fixed ${product.name}: hasOffer ${product.hasOffer} → ${correctHasOffer} (price=${product.price}, offerPrice=${product.offerPrice})`);
        fixedCount++;
      } else {
        alreadyCorrect++;
      }
    }

    console.log(`\n✅ Full Products: ${fixedCount} fixed, ${alreadyCorrect} already correct`);

    console.log('\n=== MIGRATING SHORT PRODUCTS ===\n');

    // Find all short products that need to be fixed
    const shortProductsToFix = await ShortProductModel.find({}).lean();

    let shortFixedCount = 0;
    let shortAlreadyCorrect = 0;

    for (const product of shortProductsToFix) {
      const correctHasOffer = calculateHasOffer(product.price, product.offerPrice);

      if (product.hasOffer !== correctHasOffer) {
        await ShortProductModel.findByIdAndUpdate(product._id, { hasOffer: correctHasOffer });
        console.log(`✏️  Fixed ${product.name}: hasOffer ${product.hasOffer} → ${correctHasOffer} (price=${product.price}, offerPrice=${product.offerPrice})`);
        shortFixedCount++;
      } else {
        shortAlreadyCorrect++;
      }
    }

    console.log(`\n✅ Short Products: ${shortFixedCount} fixed, ${shortAlreadyCorrect} already correct`);

    await mongoose.disconnect();
    console.log('\n✅ Migration complete!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

migrate();
