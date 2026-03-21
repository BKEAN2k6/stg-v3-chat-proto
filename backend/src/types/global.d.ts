declare global {
  declare namespace globalThis {
    var __MONGO_DB_NAME__: string; // eslint-disable-line no-var
    var __MONGO_URI__: string; // eslint-disable-line no-var
  }
}

export {};
