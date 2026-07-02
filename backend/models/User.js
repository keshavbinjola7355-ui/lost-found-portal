import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * UserSchema
 *
 * Represents a college student registered on the Lost & Found portal.
 * Passwords are hashed with bcrypt before saving (pre-save hook).
 * The `matchPassword` instance method compares a plain-text password
 * against the stored hash during login.
 */
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },

    rollNo: {
      type: String,
      required: [true, 'College Roll Number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ── Pre-save hook ────────────────────────────────────────────────────────────
// Runs before every .save() call. Only re-hashes if the password field
// was modified (avoids double-hashing on unrelated updates).
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// ── Instance method ──────────────────────────────────────────────────────────
// Compare candidate plain-text password against the stored bcrypt hash.
// Used inside authController.login.
UserSchema.methods.matchPassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;
