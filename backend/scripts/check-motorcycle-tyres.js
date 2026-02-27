const mongoose = require('mongoose');

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/tiger-vai';

async function checkMotorcycleTyres() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    console.log(`   URL: ${MONGODB_URL}\n`);

    await mongoose.connect(MONGODB_URL);
    console.log('✅ Connected successfully!\n');

    const db = mongoose.connection.db;

    console.log('='.repeat(70));
    console.log('📦 CHECKING FOR MOTORCYCLE TYRE CATEGORIES');
    console.log('='.repeat(70));

    const categories = await db.collection('categories').find({
      name: { $regex: 'motorcycle|tyre|tire|bike', $options: 'i' }
    }).toArray();

    console.log(`\n📊 Categories found: ${categories.length}\n`);

    if (categories.length === 0) {
      console.log('❌ No motorcycle/tyre categories found!');
      console.log('   💡 Suggestion: You need to create a "Motorcycle Tyre" category.\n');
    } else {
      categories.forEach((cat, index) => {
        console.log(`\n${index + 1}. Category: "${cat.name}"`);
        console.log(`   ID: ${cat._id}`);
        console.log(`   Logo: ${cat.logoUrl || 'No logo'}`);
        console.log(`   ⭐ isTop: ${cat.isTop ? '✅ YES (visible in navbar)' : '❌ NO (NOT visible in navbar)'}`);
        console.log(`   📁 Subcategories: ${cat.sub?.length || 0}`);

        if (cat.sub && cat.sub.length > 0) {
          cat.sub.forEach((sub, i) => {
            console.log(`      ${i + 1}. ${sub.SubMain} (${sub.subCategory?.length || 0} items)`);
            if (sub.subCategory && sub.subCategory.length > 0) {
              sub.subCategory.slice(0, 3).forEach((item) => {
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

    const products = await db.collection('products').find({
      $or: [
        { name: { $regex: 'motorcycle|tyre|tire|bike', $options: 'i' } },
        { 'category.main': { $regex: 'motorcycle|tyre|tire|bike', $options: 'i' } },
        { 'category.category': { $regex: 'motorcycle|tyre|tire|bike', $options: 'i' } }
      ]
    }).toArray();

    console.log(`\n📊 Products found: ${products.length}\n`);

    if (products.length === 0) {
      console.log('❌ No motorcycle/tyre products found in Product collection!');
    } else {
      products.forEach((prod, index) => {
        console.log(`\n${index + 1}. Product: "${prod.name}"`);
        console.log(`   Slug: ${prod.slug}`);
        console.log(`   💰 Price: ${prod.price}${prod.offerPrice ? ` (Offer: ${prod.offerPrice})` : ''}`);
        console.log(`   📦 Stock: ${prod.stock || 0}`);
        console.log(`   ✅ isActive: ${prod.isActive ? 'YES (visible)' : 'NO (HIDDEN)'}`);
        console.log(`   🗑️  isDeleted: ${prod.isDeleted ? 'YES' : 'NO'}`);
        console.log(`   🏷️  Category: ${prod.category?.main || 'N/A'} > ${prod.category?.category || 'N/A'}`);
        console.log(`   🏷️  Brand: ${prod.brand?.name || 'N/A'}`);
        console.log(`   🎨 Product Type: ${prod.productType || 'clothing'}`);
        console.log(`   📦 Variants: ${prod.variants?.length || 0}`);
      });
    }

    const shortProducts = await db.collection('short_products').find({
      $or: [
        { name: { $regex: 'motorcycle|tyre|tire|bike', $options: 'i' } },
        { category: { $regex: 'motorcycle|tyre|tire|bike', $options: 'i' } }
      ]
    }).toArray();

    console.log(`\n\n📊 Short Products found: ${shortProducts.length}\n`);

    if (shortProducts.length === 0) {
      console.log('❌ No motorcycle/tyre products found in ShortProduct collection!');
    } else {
      shortProducts.forEach((prod, index) => {
        console.log(`\n${index + 1}. ShortProduct: "${prod.name}"`);
        console.log(`   Slug: ${prod.slug}`);
        console.log(`   💰 Price: ${prod.price}${prod.offerPrice ? ` (Offer: ${prod.offerPrice})` : ''}`);
        console.log(`   📦 Stock: ${prod.stock || 0}`);
        console.log(`   ✅ isActive: ${prod.isActive ? 'YES (visible)' : 'NO (HIDDEN)'}`);
        console.log(`   🏷️  Main: ${prod.main || 'N/A'}`);
        console.log(`   🏷️  Category: ${prod.category || 'N/A'}`);
        console.log(`   🏷️  Brand: ${prod.brandName || 'N/A'}`);
      });
    }

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('📋 SUMMARY');
    console.log('='.repeat(70));

    const totalCategories = categories.length;
    const totalProducts = products.length;
    const totalShortProducts = shortProducts.length;
    const activeProducts = products.filter(p => p.isActive).length;
    const inactiveProducts = products.filter(p => !p.isActive).length;
    const topCategories = categories.filter(c => c.isTop).length;

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
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Make sure MongoDB is running:');
      console.log('   - If using Docker: docker-compose up -d mongodb');
      console.log('   - Or start MongoDB service: sudo systemctl start mongod');
    }
    process.exit(1);
  }
}

checkMotorcycleTyres();
