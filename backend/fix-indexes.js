const mongoose = require('mongoose');
require('dotenv').config();

async function fixIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Drop all indexes on the medicines collection
    const db = mongoose.connection.db;
    try {
      await db.collection('medicines').dropIndexes();
      console.log('All indexes dropped from medicines collection');
    } catch (error) {
      console.log('No indexes to drop or error:', error.message);
    }

    console.log('✅ Indexes fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing indexes:', error);
    process.exit(1);
  }
}

fixIndexes();