import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
let cached = (globalThis as typeof globalThis & { mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } }).mongoose;
if (!cached) { cached = { conn: null, promise: null }; (globalThis as typeof globalThis & { mongoose?: typeof cached }).mongoose = cached; }

export async function connectDatabase() {
  if (!uri) return null;
  if (cached?.conn) return cached.conn;
  if (!cached?.promise) cached!.promise = mongoose.connect(uri, { bufferCommands: false });
  cached!.conn = await cached!.promise;
  return cached!.conn;
}
