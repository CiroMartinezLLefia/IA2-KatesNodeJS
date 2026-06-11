import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

// Establish connection to MongoDB Atlas for Vercel serverless handler
await connectDB();

export default app;
