import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ProductService } from 'src/product/product.service';
import { ShortProduct } from 'src/product/entities/short-product.schema';
import { ProductHelper } from 'lib/product.helper';

/**
 * Script to update all ShortProduct documents with correct price range fields
 * Run with: npm run update-price-ranges
 */

async function updatePriceRanges() {
  console.log('🔄 Starting price range update...');

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    // Get the TenantConnectionService to access ShortProduct model
    const tenantConnection = app.get('TenantConnectionService');
    const globalProducts = 'global_products';

    const ShortProductModel = tenantConnection.getModel(
      globalProducts,
      ShortProduct.name,
    );

    // Find all active short products
    const shortProducts = await ShortProductModel.find({ isActive: true }).lean();

    console.log(`📦 Found ${shortProducts.length} products to update`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const product of shortProducts as any[]) {
      try {
        // Calculate price range from variants
        const priceRange = ProductHelper.calculatePriceRange(
          product.variants || [],
          product.price,
          product.offerPrice,
          product.hasOffer
        );

        // Check if update is needed
        const needsUpdate =
          product.minPrice !== priceRange.minPrice ||
          product.maxPrice !== priceRange.maxPrice ||
          product.minOriginalPrice !== priceRange.minOriginalPrice ||
          product.maxOriginalPrice !== priceRange.maxOriginalPrice;

        if (needsUpdate) {
          await ShortProductModel.updateOne(
            { _id: product._id },
            {
              minPrice: priceRange.minPrice,
              maxPrice: priceRange.maxPrice,
              minOriginalPrice: priceRange.minOriginalPrice,
              maxOriginalPrice: priceRange.maxOriginalPrice,
            }
          );

          updatedCount++;
          if (updatedCount % 100 === 0) {
            console.log(`✅ Updated ${updatedCount} products...`);
          }
        } else {
          skippedCount++;
        }
      } catch (error) {
        console.error(`❌ Error updating product ${product.slug}:`, error);
      }
    }

    console.log('✅ Price range update completed!');
    console.log(`📊 Updated: ${updatedCount} products`);
    console.log(`⏭️ Skipped: ${skippedCount} products (already correct)`);
  } catch (error) {
    console.error('❌ Error during price range update:', error);
  } finally {
    await app.close();
  }
}

updatePriceRanges();
