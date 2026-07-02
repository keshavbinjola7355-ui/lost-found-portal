import mongoose from 'mongoose';

/**
 * connectDB
 *
 * Establishes a connection to the MongoDB database using the MONGO_URI
 * environment variable. Exits the process on failure to prevent the
 * server from running without a database.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Non-zero exit signals failure to the OS / process manager
  }
};

export default connectDB;
