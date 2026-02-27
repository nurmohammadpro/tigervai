import mongoose from 'mongoose';
import { Category, CategorySchema } from '../src/category-brand/entities/category-brand.entity';
import { Product, ProductSchema } from '../src/product/entities/product.entity';
import { ShortProduct, ShortProductSchema } from '../src/product/entities/short-product.schema';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/tiger-vai';

async function checkMotorcycleTyres() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    console.log(`   URL: ${MONGODB_URL}\n`);

    await mongoose.connect(MONGODB_URL);
    console.log('✅ Connected successfully!\n');

    // Create models using mongoose.model() not db.model()
    const CategoryModel = mongoose.model('Category', CategorySchema);
    const ProductModel = mongoose.model('Product', ProductSchema);
    const ShortProductModel = mongoose.model('ShortProduct', ShortProductSchema);

    console.log('='.repeat(70));
    console.log('📦 CHECKING FOR MOTORCYCLE TYRE CATEGORIES');
    console.log('='.repeat(70));

    // Check for categories with motorcycle or tyre in the name
    const categorySearchTerms = ['motorcycle', 'tyre', 'tire', 'bike'];
    const categoryQuery = {
      name: { $regex: categorySearchTerms.join('|'), $options: 'i' }
    };

    const categories = await CategoryModel.find(categoryQuery).lean();

    console.log(`\n📊 Categories found: ${categories.length}\n`);

    if (categories.length === 0) {
      console.log('❌ No motorcycle/tyre categories found!');
      console.log('   Suggestion: You need to create a "Motorcycle Tyre" category.\n');
    } else {
      categories.forEach((cat: any, index: number) => {
        console.log(`\n${index + 1}. Category: "${cat.name}"`);
        console.log(`   ID: ${cat._id}`);
        console.log(`   Logo: ${cat.logoUrl || 'No logo'}`);
        console.log(`   ⭐ isTop: ${cat.isTop ? '✅ YES (visible in navbar)' : '❌ NO (NOT visible in navbar)'}`);
        console.log(`   📁 Subcategories: ${cat.sub?.length || 0}`);

        if (cat.sub && cat.sub.length > 0) {
          cat.sub.forEach((sub: any, i: number) => {
            console.log(`      ${i + 1}. ${sub.SubMain} (${sub.subCategory?.length || 0} items)`);
            if (sub.subCategory && sub.subCategory.length > 0) {
              sub.subCategory.slice(0, 3).forEach((item: string) => {
                console.log(`         - ${item}`);
              });
              if (sub.subCategory.length > 3) {
                console.log(`         ... and ${sub.subCategory.length - 3} more`);
              }
            }
          });
        }
      });
    }

    console.log('\n' + '='.repeat(70));
    console.log('🛒 CHECKING FOR MOTORCYCLE TYRE PRODUCTS');
    console.log('='.repeat(70));

    // Check for products with motorcycle or tyre in the name or category
    const productSearchTerms = ['motorcycle', 'tyre', 'tire', 'bike'];
    const productQuery = {
      $or: [
        { name: { $regex: productSearchTerms.join('|'), $options: 'i' } },
        { 'category.main': { $regex: productSearchTerms.join('|'), $options: 'i' } },
        { 'category.category': { $regex: productSearchTerms.join('|'), $options: 'i' } },
        { 'category.subMain': { $regex: productSearchTerms.join('|'), $options: 'i' } },
      ]
    };

    const products = await ProductModel.find(productQuery).lean();

    console.log(`\n📊 Full Products found: ${products.length}\n`);

    if (products.length === 0) {
      console.log('❌ No motorcycle/tyre products found in Product collection!');
    } else {
      products.forEach((prod: any, index: number) => {
        console.log(`\n${index + 1}. Product: "${prod.name}"`);
        console.log(`   Slug: ${prod.slug}`);
        console.log(`   💰 Price: ${prod.price} ${prod.offerPrice ? `(Offer: ${prod.offerPrice})` : ''}`);
        console.log(`   📦 Stock: ${prod.stock || 0}`);
        console.log(`   ✅ isActive: ${prod.isActive ? 'YES (visible)' : 'NO (HIDDEN)'}`);
        console.log(`   🗑️  isDeleted: ${prod.isDeleted ? 'YES (deleted)' : 'NO'}`);
        console.log(`   🏷️  Category: ${prod.category?.main} > ${prod.category?.subMain} > ${prod.category?.category}`);
        console.log(`   🏷️  Brand: ${prod.brand?.name}`);
        console.log(`   🎨 Product Type: ${prod.productType || 'clothing'}`);
        console.log(`   📦 Variants: ${prod.variants?.length || 0}`);
      });
    }

    // Check ShortProducts
    const shortProducts = await ShortProductModel.find(productQuery).lean();

    console.log(`\n\n📊 Short Products found: ${shortProducts.length}\n`);

    if (shortProducts.length === 0) {
      console.log('❌ No motorcycle/tyre products found in ShortProduct collection!');
    } else {
      shortProducts.forEach((prod: any, index: number) => {
        console.log(`\n${index + 1}. ShortProduct: "${prod.name}"`);
        console.log(`   Slug: ${prod.slug}`);
        console.log(`   💰 Price: ${prod.price} ${prod.offerPrice ? `(Offer: ${prod.offerPrice})` : ''}`);
        console.log(`   📦 Stock: ${prod.stock || 0}`);
        console.log(`   ✅ isActive: ${prod.isActive ? 'YES (visible in search)' : 'NO (HIDDEN from search)'}`);
        console.log(`   🏷️  Main Category: ${prod.main}`);
        console.log(`   🏷️  Category: ${prod.category}`);
        console.log(`   🏷️  Brand: ${prod.brandName}`);
      });
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📋 SUMMARY');
    console.log('='.repeat(70));

    const totalCategories = categories.length;
    const totalProducts = products.length;
    const totalShortProducts = shortProducts.length;

    const activeProducts = products.filter((p: any) => p.isActive).length;
    const inactiveProducts = products.filter((p: any) => !p.isActive).length;
    const topCategories = categories.filter((c: any) => c.isTop).length;

    console.log(`\n📊 Statistics:`);
    console.log(`   Categories: ${totalCategories}`);
    console.log(`   └─ Top Categories (visible in navbar): ${topCategories}`);
    console.log(`   └─ Non-Top Categories (NOT in navbar): ${totalCategories - topCategories}`);
    console.log(`   Products (full): ${totalProducts}`);
    console.log(`   └─ Active (visible): ${activeProducts}`);
    console.log(`   └─ Inactive (hidden): ${inactiveProducts}`);
    console.log(`   Short Products: ${totalShortProducts}`);

    console.log(`\n💡 Recommendations:`);

    if (totalCategories === 0) {
      console.log(`   ❌ Create a "Motorcycle Tyre" category`);
    } else if (topCategories === 0) {
      console.log(`   ⚠️  Mark the Motorcycle Tyre category as "Top Category" to show in navbar`);
    }

    if (totalProducts === 0) {
      console.log(`   ❌ Create motorcycle/tyre products`);
    } else if (inactiveProducts > 0) {
      console.log(`   ⚠️  ${inactiveProducts} products are inactive. Set isActive: true to make them visible`);
    }

    if (totalProducts > 0 && totalShortProducts === 0) {
      console.log(`   ⚠️  Products exist but ShortProducts are missing. This may affect search functionality`);
    }

    if (totalCategories > 0 && topCategories > 0 && activeProducts === totalProducts) {
      console.log(`   ✅ Everything looks good! Category and products should be visible.`);
    }

    await mongoose.disconnect();
    console.log('\n✅ Check complete!\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

checkMotorcycleTyres();
