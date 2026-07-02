import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';

/**
 * authRoutes
 *
 * Mounts authentication endpoints under /api/auth (set in app.js).
 *
 * Routes:
 *  POST   /api/auth/register  → Register a new student user
 *  POST   /api/auth/login     → Login with rollNo + password, receive JWT
 *  POST   /api/auth/logout    → Clear the auth cookie
 *  GET    /api/auth/me        → Get current user profile (protected)
 */
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe); // `protect` is a middleware that verifies JWT first

export default router;
