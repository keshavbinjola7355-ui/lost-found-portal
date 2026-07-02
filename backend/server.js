import dotenv from 'dotenv';
dotenv.config(); // Must be first — loads .env before any other import reads process.env

import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

/**
 * startServer
 *
 * Connects to MongoDB first, then starts the HTTP server.
 * This order guarantees the app never receives requests before
 * the database is ready.
 *
 * If connectDB() throws (e.g. wrong MONGO_URI), the process exits
 * with code 1 before app.listen is ever called.
 */
const startServer = async () => {
  await connectDB(); // Establish MongoDB connection (exits on failure)

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API base: http://localhost:${PORT}/api`);
    console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
  });
};

startServer();
