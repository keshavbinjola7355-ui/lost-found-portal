# controllers/authController.js — Line-by-Line Code Explanation

**File Location:** `backend/controllers/authController.js`  
**Role:** Handles all authentication logic — registering new users, logging in, logging out, and returning the current user's profile. Replaces the `localStorage`-based auth in `Login.jsx` and `Register.jsx` with a real database + JWT system.

---

## generateToken Helper

```js
const generateToken = (res, userId) => {
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
```
- `jwt.sign(payload, secret, options)` creates a signed JWT.
- **Payload**: `{ id: userId }` — only the MongoDB ObjectId is stored inside the token.
- **Secret**: `process.env.JWT_SECRET` — a private string only the server knows. If anyone tries to forge a token, the signature won't match.
- **Expiry**: `'7d'` — the token is valid for 7 days.

```js
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
```
- Sets the token as an **HttpOnly cookie**.
- `httpOnly: true` — the browser's JavaScript cannot read this cookie (`document.cookie`), protecting against XSS attacks.
- `secure: true` in production — only sent over HTTPS.
- `sameSite: 'strict'` — cookie is not sent in cross-site requests (CSRF protection).
- `maxAge` — 7 days in milliseconds.

---

## register

```js
export const register = async (req, res, next) => {
```

1. **Destructures** `name, rollNo, email, phone, password` from `req.body`.
2. **Validates** that all fields are present.
3. **Checks for duplicates**: `User.findOne({ $or: [{ rollNo }, { email }] })` — MongoDB `$or` checks both fields in a single query.
4. **Creates the user**: `User.create({...})` — password is hashed automatically by the pre-save hook in `User.js`.
5. **Returns** the user data + JWT token (token also set in cookie).

```js
res.status(201).json({ ... });
```
- `201 Created` is the correct HTTP status for a successful resource creation.

---

## login

```js
export const login = async (req, res, next) => {
```

1. **Validates** that both `rollNo` and `password` are provided.
2. **Finds the user**: `User.findOne({ rollNo: rollNo.toUpperCase() })` — roll numbers are always stored uppercase.
3. **Compares password**: `user.matchPassword(password)` — calls the `bcrypt.compare` instance method on the User model.
4. Both "user not found" and "wrong password" return the same error message `"Invalid credentials"` — this prevents **user enumeration attacks** (attackers can't tell if a roll number exists or not).
5. On success, generates and returns the JWT.

---

## logout

```js
res.cookie('token', '', {
  httpOnly: true,
  expires: new Date(0),
});
```
- Clears the cookie by setting its value to an empty string and its expiry to epoch time (the past). The browser immediately discards it.

---

## getMe

```js
export const getMe = (req, res) => {
  const { _id, name, rollNo, email, phone, createdAt } = req.user;
  res.json({ _id, name, rollNo, email, phone, createdAt });
};
```
- `req.user` was already set by the `protect` middleware — no extra DB call needed.
- Returns the user's profile data. The password is never included.

---

## Frontend Comparison

| Old `Login.jsx` (localStorage) | New `authController.login` (MongoDB + JWT) |
|--------------------------------|-------------------------------------------|
| `localStorage.getItem('college-user')` | `User.findOne({ rollNo })` |
| Plain-text password comparison | `bcrypt.compare()` |
| No session | JWT in HttpOnly cookie |
| Data lost on browser clear | Persists in MongoDB |
