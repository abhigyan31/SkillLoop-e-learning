// lib/mongoose.js
// Caches the Mongoose connection across serverless invocations (prevents too many connections).

const mongoose = require('mongoose');

// const MONGODB_URI ="mongodb+srv://Pratap:Pratap@pratap.wykz1my.mongodb.net/?appName=pratap"
const MONGODB_URI = "mongodb+srv://Pratap:Pratap@cluster0.monovn6.mongodb.net/?appName=Cluster0"

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside Vercel.');
}

/**
 * Global is used to cache connection in dev and serverless environments
 * so we don't open many connections.
 */
let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // other options as desired
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectToDatabase;
