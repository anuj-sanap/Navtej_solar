import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = globalThis as unknown as { mongoose?: MongooseCache };

let cached = globalForMongoose.mongoose;
if (!cached) {
  cached = { conn: null, promise: null };
  globalForMongoose.mongoose = cached;
}

export async function connectDatabase(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/navtej_solar";

  if (!uri) {
    console.error("[Database] MONGODB_URI is not set and no fallback available.");
    return null;
  }

  if (cached?.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };
    cached!.promise = mongoose.connect(uri, opts);
  }

  try {
    cached!.conn = await cached!.promise;
    return cached!.conn;
  } catch (error) {
    cached!.promise = null;
    cached!.conn = null;
    console.error("[Database] Error connecting to MongoDB:", error);
    return null;
  }
}
