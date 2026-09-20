const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/credit_card_fraud';

  try {
    // Attempt standard connection
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[MongoDB] Connected successfully to: ${uri}`);
  } catch (err) {
    console.warn(`[MongoDB] Could not connect to primary URI (${uri}): ${err.message}`);
    console.log('[MongoDB] Starting in-memory MongoDB server as fallback for development...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();

      await mongoose.connect(memoryUri);
      console.log(`[MongoDB] Connected to in-memory MongoDB database: ${memoryUri}`);
    } catch (memErr) {
      console.error(`[MongoDB] In-memory server fallback failed: ${memErr.message}`);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
