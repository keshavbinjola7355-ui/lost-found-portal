import mongoose from 'mongoose';
import dns from 'dns';

// ── Force Google DNS (8.8.8.8) ───────────────────────────────────────────────
// The local router DNS cannot resolve MongoDB Atlas SRV records (_mongodb._tcp.*).
// We override the system resolver here so Node.js uses Google's public DNS,
// which correctly resolves the SRV record used in mongodb+srv:// URIs.
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

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
