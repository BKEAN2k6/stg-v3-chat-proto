import process from 'node:process';

const mongoSetup = async () => {
  const skipMongo = process.env.SKIP_MONGO_SETUP === 'true';
  if (skipMongo) {
    return async () => {
      // No Mongo setup needed when skipping
    };
  }

  const {setup, teardown} = await import('vitest-mongodb');

  // Start Mongo and let vitest-mongodb set its globals in THIS context
  await setup();

  // Bridge those values into env vars that the workers can read
  process.env.MONGO_URL = globalThis.__MONGO_URI__;

  // Return teardown so Vitest will call it once after the run
  return async () => {
    await teardown();
  };
};

export default mongoSetup;
