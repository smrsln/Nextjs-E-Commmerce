import mongoose from "mongoose";

async function connectToMongoDB() {
  const MONGODB_URI = process.env.MONGODB_URI || "";
  const client = await mongoose.connect(MONGODB_URI);

  return client.connection.db;
}

export { connectToMongoDB };
