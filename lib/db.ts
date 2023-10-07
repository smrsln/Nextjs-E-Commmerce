import mongoose from "mongoose";

export const connectToMongoDB = async () => {
  let isConnected = false;
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }
  try {
    const client = await mongoose.connect(process.env.MONGODB_URI || "");
    isConnected = true;
    console.log("MongoDB connected");
    return client.connection.db;
  } catch (error) {
    console.log(error);
  }
};
