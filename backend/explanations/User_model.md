# models/User.js — Line-by-Line Code Explanation

**File Location:** `backend/models/User.js`  
**Role:** Defines the MongoDB schema for a student user account. Handles password hashing automatically via a pre-save hook, and provides a helper method `matchPassword` for login comparison. Mirrors the fields from `frontend/src/pages/Register.jsx`.

---

## Imports

```js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
```
- `mongoose` — for schema definition and model creation.
- `bcrypt` — for secure password hashing. Never store plain-text passwords.

---

## Schema Definition

```js
const UserSchema = new mongoose.Schema({ ... }, { timestamps: true });
```
- `new mongoose.Schema()` defines the shape (structure and rules) for documents stored in the `users` collection.
- `timestamps: true` automatically adds two fields to every document:
  - `createdAt` — when the user registered
  - `updatedAt` — when the document was last modified

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | String, required | Student's full name |
| `rollNo` | String, required, unique, uppercase | College roll number (e.g. `CS2024001`) |
| `email` | String, required, unique, lowercase | College email address |
| `phone` | String, required | Contact phone number |
| `password` | String, required, min 6 chars | Stored as bcrypt hash |

```js
rollNo: { ..., unique: true, uppercase: true }
```
- `unique: true` creates a MongoDB index — ensures no two users share the same roll number.
- `uppercase: true` normalises input (e.g. `cs2024` → `CS2024`) before saving.

```js
email: { ..., lowercase: true, match: [/\S+@\S+\.\S+/, 'Please enter a valid email'] }
```
- `lowercase: true` normalises emails.
- `match` with a regex validates the format.

---

## Pre-Save Hook

```js
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});
```

- `pre('save', ...)` — Mongoose middleware that runs **before** every `.save()` call.
- `this` refers to the current document being saved.
- `this.isModified('password')` — Returns `true` only if the password field changed. This prevents re-hashing an already-hashed password when other fields are updated.
- `bcrypt.hash(password, 10)` — Hashes the password with 10 salt rounds. More rounds = more secure but slower.
- After hashing, `this.password` is replaced with the hash and `next()` continues the save.

---

## Instance Method: matchPassword

```js
UserSchema.methods.matchPassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
```

- Instance methods are available on every document returned from `User.findOne()` etc.
- `bcrypt.compare(plain, hash)` — returns `true` if the plain-text matches the hash. Used in `authController.login`.
- We never decrypt the hash — bcrypt is a one-way function.

---

## Model Creation & Export

```js
const User = mongoose.model('User', UserSchema);
export default User;
```
- `mongoose.model('User', UserSchema)` creates the `User` model.
- Mongoose automatically creates a MongoDB collection called `users` (lowercased, pluralised model name).
