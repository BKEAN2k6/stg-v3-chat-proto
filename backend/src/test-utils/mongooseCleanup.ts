import process from 'node:process';
import mongoose from 'mongoose';
import {afterAll, beforeAll} from 'vitest';

const skipMongo = process.env.SKIP_MONGO_SETUP === 'true';

if (!skipMongo) {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoose.connection.db?.dropDatabase();
    await mongoose.disconnect();
  });
}
