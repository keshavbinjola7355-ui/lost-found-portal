import express from 'express';
import {
  getFoundReports,
  getFoundReportById,
  createFoundReport,
  updateFoundReport,
  deleteFoundReport,
} from '../controllers/foundController.js';
import protect from '../middleware/authMiddleware.js';

/**
 * foundRoutes
 *
 * Mounts found-report endpoints under /api/found (set in app.js).
 *
 * Routes:
 *  GET    /api/found       → Get all found reports (public, filterable via query string)
 *  POST   /api/found       → Create a new found report (protected)
 *  GET    /api/found/:id   → Get a single found report by ID (public)
 *  PUT    /api/found/:id   → Update a found report (protected + owner only)
 *  DELETE /api/found/:id   → Delete a found report (protected + owner only)
 */
const router = express.Router();

router.route('/')
  .get(getFoundReports)
  .post(protect, createFoundReport);

router.route('/:id')
  .get(getFoundReportById)
  .put(protect, updateFoundReport)
  .delete(protect, deleteFoundReport);

export default router;
