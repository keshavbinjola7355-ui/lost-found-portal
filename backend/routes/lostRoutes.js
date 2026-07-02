import express from 'express';
import {
  getLostReports,
  getLostReportById,
  createLostReport,
  updateLostReport,
  deleteLostReport,
} from '../controllers/lostController.js';
import protect from '../middleware/authMiddleware.js';

/**
 * lostRoutes
 *
 * Mounts lost-report endpoints under /api/lost (set in app.js).
 *
 * Routes:
 *  GET    /api/lost       → Get all lost reports (public, filterable via query string)
 *  POST   /api/lost       → Create a new lost report (protected)
 *  GET    /api/lost/:id   → Get a single lost report by ID (public)
 *  PUT    /api/lost/:id   → Update a lost report (protected + owner only)
 *  DELETE /api/lost/:id   → Delete a lost report (protected + owner only)
 */
const router = express.Router();

// Collection-level routes
router.route('/')
  .get(getLostReports)               // No auth required to view all
  .post(protect, createLostReport);  // Must be logged in to create

// Document-level routes
router.route('/:id')
  .get(getLostReportById)
  .put(protect, updateLostReport)
  .delete(protect, deleteLostReport);

export default router;
