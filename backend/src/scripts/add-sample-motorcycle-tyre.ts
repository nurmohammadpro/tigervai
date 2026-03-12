/**
 * Standalone script to add a sample motorcycle tyre product
 * Run with: npx ts-node -P tsconfig.json src/scripts/add-sample-motorcycle-tyre.ts
 */

import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URL = 'mongodb://localhost:27017/?tls=false';
const DB_NAME = 'tiger-vendor';

// Sample motorcycle tyre product
const sampleMotorcycleTyreProduct = {
  name: 'Michelin City Grip Saver',
  description: '<p>High-performance motorcycle tyre designed for urban commuting. Excellent wet and dry grip with long-lasting tread life.</p><p><strong>Features:</strong></p><ul><li>Urban commuting design</li><li>Excellent wet grip</li><li>Long tread life</li><li>Low rolling resistance</li></ul>',
  shortDescription: 'Premium city tyre for everyday commuting with excellent wet grip',
  price: 5700,
  stock: 37,
  offerPrice: 5400,
  hasOffer: true,
  isAdminCreated: true,
  isActive: true,
  isDeleted: false,
  isDigital: false,

  // Category - Motorcycle Tyre
  category: {
    main: 'Motorcycle Tyre',
    subMain: 'General',
    category: 'All',
  },

  // Brand
  brand: {
    name: 'Michelin',
  },

  // Thumbnail (placeholder - replace with actual image)
  thumbnail: {
    url: 'https://placehold.co/600x600/eE4A23/white?text=Michelin+City+Grip',
    key: 'michelin-city-grip-thumb',
    id: 'thumb-001',
  },

  // Images
  images: [
    {
      url: 'https://placehold.co/600x600/eE4A23/white?text=Michelin+Front',
      key: 'michelin-front',
      id: 'img-001',
    },
  ],

  // Tyre Variants with front/rear/combo
  variants: [
    {
      size: 'front - 110/70 R17',
      price: 5700,
      discountPrice: 5400,
      stock: 15,
      season: 'All-Season',
      loadIndex: '91',
      speedRating: 'H',
      recommended: 'KTM Duke 125, KTM RC 125, Yamaha R15 V3, Yamaha MT-15',
      variantType: 'front',
      isAvailable: true,
    },
    {
      size: 'rear - 140/60 R17',
      price: 6200,
      discountPrice: 5900,
      stock: 12,
      season: 'All-Season',
      loadIndex: '94',
      speedRating: 'H',
      recommended: 'KTM Duke 125, KTM RC 125, Yamaha R15 V3, Yamaha MT-15',
      variantType: 'rear',
      isAvailable: true,
    },
    {
      size: 'combo - Front + Rear Set',
      price: 11900,
      discountPrice: 10900,
      stock: 10,
      season: 'All-Season',
      recommended: 'KTM Duke 125, KTM RC 125, Yamaha R15 V3, Yamaha MT-15',
      variantType: 'combo',
      isAvailable: true,
    },
  ],

  // Empty arrays for other fields
  colorsImage: [],
  features: [],

  // Specifications
  specifications: {
    'Brand': 'Michelin',
    'Model': 'City Grip',
    'Tyre Type': 'Tubeless',
    'Rim Size': '17 inch',
    'Width': '110/140',
    'Aspect Ratio': '70/60',
    'Speed Rating': 'H (up to 210 km/h)',
    'Load Index': '91/94',
    'Construction': 'Radial',
    'Tube Type': 'Tubeless',
  },

  // Shipping
  shippingTime: '2-3 business days',
  shippingCost: 100,
  freeShipping: false,

  // SEO
  slug: 'michelin-city-grip-saver-motorcycle-tyre',

  // Type
  productType: 'tyre',

  // Timestamps
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function addSampleMotorcycleTyre() {
  let client: MongoClient | undefined = undefined;

  try {
    client = new MongoClient(MONGODB_URL);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection('products');

    // Check if product already exists
    const existingProduct = await collection.findOne({
      slug: sampleMotorcycleTyreProduct.slug,
    });

    if (existingProduct) {
      console.log('⚠️  Sample motorcycle tyre product already exists. Skipping...');
      await client.close();
      return;
    }

    // Insert the product
    // Note: brand will use the default brand object from the schema
    const result = await collection.insertOne(sampleMotorcycleTyreProduct);
    console.log('✅ Sample motorcycle tyre product created successfully!');
    console.log(`   Product ID: ${result.insertedId}`);
    console.log(`   Name: ${sampleMotorcycleTyreProduct.name}`);
    console.log(`   Category: ${sampleMotorcycleTyreProduct.category.main}`);
    console.log(`   Variants: ${sampleMotorcycleTyreProduct.variants.length} (Front, Rear, Combo)`);
    console.log(`   Price Range: Tk ${sampleMotorcycleTyreProduct.variants[0].discountPrice} - Tk ${sampleMotorcycleTyreProduct.variants[2].price}`);
    console.log('');
    console.log('   🛞 Front Tyre: 110/70 R17 - Tk 5,400 (15 stock)');
    console.log('   🛞 Rear Tyre: 140/60 R17 - Tk 5,900 (12 stock)');
    console.log('   🛞 Combo Set: Front + Rear - Tk 10,900 (10 stock)');

    await client.close();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error adding sample product:', error);
    if (client) {
      await client.close();
    }
    process.exit(1);
  }
}

// Run the function
addSampleMotorcycleTyre();
