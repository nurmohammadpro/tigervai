/**
 * Standalone script to add Car Tyre and Motorcycle Tyre categories
 * Run with: npx ts-node -P tsconfig.json src/scripts/add-tyre-categories-simple.ts
 */

import { MongoClient } from 'mongodb';

const MONGODB_URL = 'mongodb://localhost:27017/?tls=false';
const DB_NAME = 'tiger-vendor';

const TYRE_CATEGORIES = [
  {
    name: 'Car Tyre',
    sub: [
      {
        SubMain: 'Season',
        subCategory: ['Summer', 'Winter', 'All-Season'],
      },
      {
        SubMain: 'Vehicle Type',
        subCategory: ['Sedan', 'SUV', 'Hatchback', 'Crossover', 'Truck', 'Van'],
      },
      {
        SubMain: 'Size',
        subCategory: ['12-15 inch', '16-17 inch', '18-20 inch', '21+ inch'],
      },
      {
        SubMain: 'Brand Type',
        subCategory: ['Premium', 'Budget', 'Mid-Range'],
      },
    ],
    isTop: true,
    logoUrl: 'https://placehold.co/256x256/eE4A23/white?text=Car+Tyre',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'Motorcycle Tyre',
    sub: [
      {
        SubMain: 'Season',
        subCategory: ['Summer', 'Winter', 'All-Season'],
      },
      {
        SubMain: 'Bike Type',
        subCategory: ['Sport', 'Cruiser', 'Touring', 'Off-Road', 'Scooter', 'Dual-Sport'],
      },
      {
        SubMain: 'Position',
        subCategory: ['Front', 'Rear', 'Front & Rear Set'],
      },
      {
        SubMain: 'Size',
        subCategory: ['Small', 'Medium', 'Large'],
      },
      {
        SubMain: 'Brand Type',
        subCategory: ['Premium', 'Budget', 'Mid-Range'],
      },
    ],
    isTop: true,
    logoUrl: 'https://placehold.co/256x256/342F2C/white?text=Moto+Tyre',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function addTyreCategories() {
  console.log('🚀 Connecting to MongoDB...');

  const client = new MongoClient(MONGODB_URL);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);
    const collection = db.collection('category');

    // Check if categories already exist
    const existingCarTyre = await collection.findOne({ name: 'Car Tyre' });
    const existingMotorcycleTyre = await collection.findOne({ name: 'Motorcycle Tyre' });

    if (existingCarTyre) {
      console.log('⚠️  Car Tyre category already exists, skipping...');
    } else {
      await collection.insertOne(TYRE_CATEGORIES[0]);
      console.log('✅ Car Tyre category created successfully!');
    }

    if (existingMotorcycleTyre) {
      console.log('⚠️  Motorcycle Tyre category already exists, skipping...');
    } else {
      await collection.insertOne(TYRE_CATEGORIES[1]);
      console.log('✅ Motorcycle Tyre category created successfully!');
    }

    console.log('\n📊 Current Categories:');
    const allCategories = await collection.find({}).toArray();
    allCategories.forEach((cat: any) => {
      const subCount = cat.sub?.length || 0;
      console.log(`  - ${cat.name} (${subCount} sub-groups)`);
    });

    console.log('\n✨ Tyre categories setup complete!');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
}

// Run the script
addTyreCategories()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
