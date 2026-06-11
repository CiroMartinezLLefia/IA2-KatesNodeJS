import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

// Database connection middleware for Vercel Serverless environment
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(500).json({
      missatge: 'Error de connexió amb la base de dades a Vercel',
      error: error.message
    });
  }
});

export default app;
