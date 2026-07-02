import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * protect
 *
 * Express middleware that guards routes requiring authentication.
 *
 * Flow:
 *  1. Reads the JWT from the Authorization header (Bearer <token>)
 *     OR from an HttpOnly cookie named "token".
 *  2. Verifies the token signature and expiry using JWT_SECRET.
 *  3. Fetches the matching User from MongoDB (excluding the password field).
 *  4. Attaches the user document to req.user so downstream controllers
 *     can use it without another DB call.
 *  5. Calls next() on success; sends 401 on any failure.
 */
const protect = async (req, res, next) => {
  let token;

  // ── 1. Extract token ────────────────────────────────────────────────────
  // Check Authorization header first, then fall back to cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1]; // "Bearer <token>" → "<token>"
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  // ── 2. Token missing ────────────────────────────────────────────────────
  if (!token) {
    return res.status(401).json({ message: 'Not authorized — no token provided' });
  }

  try {
    // ── 3. Verify token ──────────────────────────────────────────────────
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = { id: '<userId>', iat: ..., exp: ... }

    // ── 4. Fetch user from DB ────────────────────────────────────────────
    req.user = await User.findById(decoded.id).select('-password');
    // .select('-password') strips the hashed password from the result

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized — user not found' });
    }

    // ── 5. Pass control to the next middleware / controller ───────────────
    next();
  } catch (error) {
    // Token is invalid, expired, or tampered with
    return res.status(401).json({ message: 'Not authorized — invalid token' });
  }
};

export default protect;
