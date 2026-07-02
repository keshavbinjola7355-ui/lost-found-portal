import express from 'express';
import {
  getCombinedFeed,
  getStats,
  getMyReports,
} from '../controllers/reportController.js';
import protect from '../middleware/authMiddleware.js';

/**
 * reportRoutes
 *
 * Mounts combined-report endpoints under /api/reports (set in app.js).
 *
 * Routes:
 *  GET    /api/reports       → Combined lost + found feed (public, filterable)
 *  GET    /api/reports/stats → Aggregate stats: totalLost, totalFound, totalResolved (public)
 *  GET    /api/reports/my    → Current user's own reports (protected)
 *
 * IMPORTANT: /stats and /my must be defined BEFORE /:id style routes
 * to prevent Express from treating "stats" or "my" as an ID parameter.
 */
const router = express.Router();

router.get('/', getCombinedFeed);
router.get('/stats', getStats);
router.get('/my', protect, getMyReports); // Auth required

export default router;
