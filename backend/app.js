import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// ── Route Imports ────────────────────────────────────────────────────────────
import authRoutes from './routes/authRoutes.js';
import lostRoutes from './routes/lostRoutes.js';
import foundRoutes from './routes/foundRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

// ── Error Middleware ─────────────────────────────────────────────────────────
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// ── Load .env ────────────────────────────────────────────────────────────────
// Must be called before any process.env access
dotenv.config();

// ── App Initialisation ───────────────────────────────────────────────────────
const app = express();

// ── Global Middleware ────────────────────────────────────────────────────────

// Parse incoming JSON request bodies (e.g. POST /api/auth/register)
app.use(express.json());

// Parse URL-encoded bodies (HTML form submissions)
app.use(express.urlencoded({ extended: true }));

// Parse cookies from the Cookie header into req.cookies
// Used by authMiddleware to read the HttpOnly JWT cookie
app.use(cookieParser());

// ── CORS ─────────────────────────────────────────────────────────────────────
// Allow requests from the Vite dev server (frontend) during development.
// In production, replace the origin with your actual deployed frontend URL.
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173', // Vite default dev port
    'http://localhost:3000', // Alternative CRA / Next.js port
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow cookies

  // Handle preflight (OPTIONS) requests immediately
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// ── Health Check ─────────────────────────────────────────────────────────────
// Simple endpoint to verify the server is running (useful for deployment checks)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'College Lost & Found API is running',
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ───────────────────────────────────────────────────────────────
// All route files are mounted under the /api prefix.
// Express will match requests to these routers based on the path prefix.

app.use('/api/auth', authRoutes);       // /api/auth/register, /api/auth/login, ...
app.use('/api/lost', lostRoutes);       // /api/lost, /api/lost/:id
app.use('/api/found', foundRoutes);     // /api/found, /api/found/:id
app.use('/api/reports', reportRoutes);  // /api/reports, /api/reports/stats, /api/reports/my

// ── Error Handling ───────────────────────────────────────────────────────────
// These must be LAST — after all routes.

// 404 handler: catches any request that didn't match a route above
app.use(notFound);

// Global error handler: catches errors forwarded by next(error) calls
app.use(errorHandler);

export default app;
