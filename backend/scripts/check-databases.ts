/**
 * Diagnostic script to find products in MongoDB
 */
import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017';

async function checkDatabases() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URL);
    console.log('✅ Connected successfully!\n');

    const adminDb = mongoose.connection.db?.admin();
    if (!adminDb) {
      console.error('❌ Cannot access admin database');
      process.exit(1);
    }

    const databases = await adminDb.listDatabases();

    console.log('=== AVAILABLE DATABASES ===\n');
    databases.databases.forEach((db: any) => {
      const size = db.sizeOnDisk ? (db.sizeOnDisk / 1024).toFixed(2) + ' KB' : 'N/A';
      console.log(`📁 ${db.name} (size: ${size})`);
    });

    console.log('\n=== CHECKING COMMON DATABASE NAMES ===\n');

    // Check common database names
    const dbNames = ['tiger-vai', 'tiger-vai-products', 'admin', 'products'];

    for (const dbName of dbNames) {
      try {
        const db = mongoose.connection.useDb(dbName, { useCache: false });
        const collections = await db.listCollections();

        console.log(`\n📊 Database: ${dbName}`);

        const collArray = await collections.toArray();
        if (collArray.length === 0) {
          console.log('   No collections found');
          continue;
        }

        for (const coll of collArray) {
          const count = await db.collection(coll.name).countDocuments();
          console.log(`   - ${coll.name}: ${count} documents`);

          // Show a sample document if it's a product-related collection
          if (coll.name.toLowerCase().includes('product') && count > 0) {
            const sample = await db.collection(coll.name).findOne();
            if (sample) {
              console.log(`     Sample fields: ${Object.keys(sample).slice(0, 10).join(', ')}`);
            }
          }
        }
      } catch (err: any) {
        console.log(`   ❌ Error: ${err.message}`);
      }
    }

    await mongoose.disconnect();
    console.log('\n✅ Diagnostics complete!');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkDatabases();
