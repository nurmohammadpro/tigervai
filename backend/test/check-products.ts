import mongoose from 'mongoose';
import { Product, ProductSchema } from '../src/product/entities/product.entity';
import { ShortProduct, ShortProductSchema } from '../src/product/entities/short-product.schema';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const DB_NAME = 'tiger-vai-products';

async function checkProducts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URL);
    console.log('Connected successfully!\n');

    // Get the database
    const db = mongoose.connection.useDb(DB_NAME);

    // Create models
    const ProductModel = db.model('Product', ProductSchema);
    const ShortProductModel = db.model('ShortProduct', ShortProductSchema);

    console.log('=== CHECKING FULL PRODUCTS ===\n');
    const products = await ProductModel.find({}).lean();

    console.log(`Total products: ${products.length}\n`);

    // Issue 1: Products with offerPrice but hasOffer is false
    const issue1 = products.filter(p =>
      p.offerPrice && p.offerPrice > 0 && !p.hasOffer
    );
    console.log(`❌ Issue 1: Products with offerPrice > 0 but hasOffer = false: ${issue1.length}`);
    if (issue1.length > 0) {
      issue1.forEach(p => {
        console.log(`   - ${p.name}: price=${p.price}, offerPrice=${p.offerPrice}, hasOffer=${p.hasOffer}`);
      });
    }

    // Issue 2: Products with hasOffer true but offerPrice is 0 or undefined
    const issue2 = products.filter(p =>
      p.hasOffer && (!p.offerPrice || p.offerPrice <= 0)
    );
    console.log(`\n❌ Issue 2: Products with hasOffer = true but offerPrice is invalid: ${issue2.length}`);
    if (issue2.length > 0) {
      issue2.forEach(p => {
        console.log(`   - ${p.name}: price=${p.price}, offerPrice=${p.offerPrice}, hasOffer=${p.hasOffer}`);
      });
    }

    // Issue 3: Products with offerPrice >= price (invalid discount)
    const issue3 = products.filter(p =>
      p.offerPrice && p.price && p.offerPrice >= p.price
    );
    console.log(`\n⚠️  Issue 3: Products with offerPrice >= price: ${issue3.length}`);
    if (issue3.length > 0) {
      issue3.forEach(p => {
        console.log(`   - ${p.name}: price=${p.price}, offerPrice=${p.offerPrice}`);
      });
    }

    // Display products with valid discounts
    const validDiscounts = products.filter(p =>
      p.hasOffer && p.offerPrice && p.offerPrice > 0 && p.offerPrice < p.price
    );
    console.log(`\n✅ Products with valid discounts: ${validDiscounts.length}`);
    if (validDiscounts.length > 0) {
      validDiscounts.slice(0, 5).forEach(p => {
        const discount = Math.round(((p.price - p.offerPrice) / p.price) * 100);
        console.log(`   - ${p.name}: price=${p.price}, offerPrice=${p.offerPrice}, discount=${discount}%`);
      });
      if (validDiscounts.length > 5) {
        console.log(`   ... and ${validDiscounts.length - 5} more`);
      }
    }

    // Check ShortProducts
    console.log('\n\n=== CHECKING SHORT PRODUCTS ===\n');
    const shortProducts = await ShortProductModel.find({}).lean();

    console.log(`Total short products: ${shortProducts.length}\n`);

    // Same issues for short products
    const shortIssue1 = shortProducts.filter(p =>
      p.offerPrice && p.offerPrice > 0 && !p.hasOffer
    );
    console.log(`❌ Issue 1: ShortProducts with offerPrice > 0 but hasOffer = false: ${shortIssue1.length}`);
    if (shortIssue1.length > 0) {
      shortIssue1.slice(0, 5).forEach(p => {
        console.log(`   - ${p.name}: price=${p.price}, offerPrice=${p.offerPrice}, hasOffer=${p.hasOffer}`);
      });
    }

    await mongoose.disconnect();
    console.log('\n✅ Check complete!');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProducts();
