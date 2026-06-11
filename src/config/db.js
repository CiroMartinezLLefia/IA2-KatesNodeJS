import mongoose from 'mongoose';

let cachedConnection = null;

export const connectDB = async () => {
  // If connection is already open, reuse it
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/api_cervezas';
    const conn = await mongoose.connect(connUri);
    cachedConnection = conn;
    console.log(`MongoDB Connectat: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error de connexió a MongoDB: ${error.message}`);
    throw error;
  }
};
