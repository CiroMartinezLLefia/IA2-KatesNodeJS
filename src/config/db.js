import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/api_cervezas';
    const conn = await mongoose.connect(connUri);
    console.log(`MongoDB Connectat: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error de connexió a MongoDB: ${error.message}`);
    process.exit(1);
  }
};
