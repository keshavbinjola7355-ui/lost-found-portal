import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ── Helper ───────────────────────────────────────────────────────────────────
/**
 * generateToken
 *
 * Creates a signed JWT containing the user's MongoDB _id.
 * Token expires in 7 days.
 * Also sets the token as an HttpOnly cookie so it's
 * automatically sent with subsequent requests from the browser.
 *
 * @param {Object} res - Express response object (used to set cookie)
 * @param {string} userId - MongoDB ObjectId string of the user
 * @returns {string} The signed JWT string
 */
const generateToken = (res, userId) => {
  const token = jwt.sign(
    { id: userId },           // Payload: just the user ID
    process.env.JWT_SECRET,   // Secret key from .env
    { expiresIn: '7d' }       // Token lifetime
  );

  // Set as HttpOnly cookie (prevents JS access → XSS protection)
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  return token;
};

// ── Controller Functions ─────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/register
 * @access  Public
 * @desc    Register a new student user
 *
 * Reads: name, rollNo, email, phone, password from req.body
 * Returns: user object + JWT token
 */
export const register = async (req, res, next) => {
  try {
    const { name, rollNo, email, phone, password } = req.body;

    // ── Validation ────────────────────────────────────────────────────────
    if (!name || !rollNo || !email || !phone || !password) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    // Check if rollNo or email already exists in DB
    const existingUser = await User.findOne({ $or: [{ rollNo }, { email }] });
    if (existingUser) {
      res.status(409); // 409 = Conflict
      throw new Error(
        existingUser.rollNo === rollNo
          ? 'Roll number already registered'
          : 'Email already registered'
      );
    }

    // ── Create User ───────────────────────────────────────────────────────
    // Password is hashed automatically by the pre-save hook in User.js
    const user = await User.create({ name, rollNo, email, phone, password });

    // ── Respond ───────────────────────────────────────────────────────────
    const token = generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      rollNo: user.rollNo,
      email: user.email,
      phone: user.phone,
      token, // Also returned in body for clients that use localStorage/headers
    });
  } catch (error) {
    next(error); // Forward to global errorHandler middleware
  }
};

/**
 * @route   POST /api/auth/login
 * @access  Public
 * @desc    Authenticate user with rollNo + password
 *
 * Reads: rollNo, password from req.body
 * Returns: user object + JWT token
 */
export const login = async (req, res, next) => {
  try {
    const { rollNo, password } = req.body;

    // ── Validation ────────────────────────────────────────────────────────
    if (!rollNo || !password) {
      res.status(400);
      throw new Error('Please provide Roll Number and Password');
    }

    // ── Find User ─────────────────────────────────────────────────────────
    // rollNo is stored uppercase (see User model), so normalise input
    const user = await User.findOne({ rollNo: rollNo.toUpperCase() });

    if (!user) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    // ── Compare Password ──────────────────────────────────────────────────
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    // ── Respond ───────────────────────────────────────────────────────────
    const token = generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      rollNo: user.rollNo,
      email: user.email,
      phone: user.phone,
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/logout
 * @access  Private
 * @desc    Clear the auth cookie to log the user out
 */
export const logout = (req, res) => {
  // Clear the HttpOnly cookie by setting maxAge to 0
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // Immediately expired
  });
  res.json({ message: 'Logged out successfully' });
};

/**
 * @route   GET /api/auth/me
 * @access  Private (requires valid JWT via protect middleware)
 * @desc    Return the currently authenticated user's profile
 *
 * req.user is already attached by the protect middleware
 */
export const getMe = (req, res) => {
  const { _id, name, rollNo, email, phone, createdAt } = req.user;
  res.json({ _id, name, rollNo, email, phone, createdAt });
};
