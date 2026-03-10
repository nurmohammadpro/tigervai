import { ConnectOptions } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from '../category-brand/entities/category-brand.entity';

/**
 * Script to add Car Tyre and Motorcycle Tyre categories
 * Run with: npm run add-tyre-categories
 */

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
  },
];

async function addTyreCategories() {
  console.log('🚀 Starting to add tyre categories...');

  // Create a simple NestJS application context
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: false,
  });

  // Get the Category model from the database
  const categoryModel = app.get('CATEGORY_MODEL');

  try {
    // Check if categories already exist
    const existingCarTyre = await categoryModel.findOne({ name: 'Car Tyre' });
    const existingMotorcycleTyre = await categoryModel.findOne({ name: 'Motorcycle Tyre' });

    if (existingCarTyre) {
      console.log('⚠️  Car Tyre category already exists, skipping...');
    } else {
      await categoryModel.create(TYRE_CATEGORIES[0]);
      console.log('✅ Car Tyre category created successfully!');
    }

    if (existingMotorcycleTyre) {
      console.log('⚠️  Motorcycle Tyre category already exists, skipping...');
    } else {
      await categoryModel.create(TYRE_CATEGORIES[1]);
      console.log('✅ Motorcycle Tyre category created successfully!');
    }

    console.log('\n📊 Current Categories:');
    const allCategories = await categoryModel.find({});
    allCategories.forEach((cat: any) => {
      console.log(`  - ${cat.name} (${cat.sub?.length || 0} sub-groups)`);
    });

    console.log('\n✨ Tyre categories setup complete!');
  } catch (error) {
    console.error('❌ Error adding tyre categories:', error);
    throw error;
  } finally {
    await app.close();
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
