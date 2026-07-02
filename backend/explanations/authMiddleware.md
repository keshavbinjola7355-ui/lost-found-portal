# middleware/authMiddleware.js — Line-by-Line Code Explanation

**File Location:** `backend/middleware/authMiddleware.js`  
**Role:** A "guard" middleware that sits in front of protected routes. It verifies the caller's identity using a JWT and blocks unauthorized access.

---

## What is Middleware?

In Express, middleware is a function that runs **between** receiving a request and sending a response. It has access to `req`, `res`, and `next`. Calling `next()` passes control to the next middleware or route handler.

---

## Imports

```js
import jwt from 'jsonwebtoken';
```
- The `jsonwebtoken` library for creating and verifying JSON Web Tokens.

```js
import User from '../models/User.js';
```
- The User model — needed to look up the full user document from the database using the ID stored in the token.

---

## Step 1: Extract Token

```js
let token;

if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
  token = req.headers.authorization.split(' ')[1];
} else if (req.cookies?.token) {
  token = req.cookies.token;
}
```

- The token can arrive in two ways:
  1. **Authorization header**: `Authorization: Bearer eyJhbGci...` — common in mobile/React Native apps or Axios with manual headers.
  2. **HttpOnly Cookie**: Automatically sent by the browser. More secure because JavaScript cannot access it (XSS protection).
- We check both and prefer the header. If neither exists, `token` stays `undefined`.

---

## Step 2: Missing Token Check

```js
if (!token) {
  return res.status(401).json({ message: 'Not authorized — no token provided' });
}
```
- `401 Unauthorized` — The request is missing credentials entirely. `return` stops execution immediately.

---

## Step 3: Verify the Token

```js
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```
- `jwt.verify()` does two things at once:
  1. **Validates the signature** — ensures the token was signed with our `JWT_SECRET` and hasn't been tampered with.
  2. **Checks expiry** — rejects tokens past their `exp` date.
- If valid, it returns the decoded payload: `{ id: '<userId>', iat: ..., exp: ... }`.
- If invalid/expired, it throws an error (caught by the `catch` block).

---

## Step 4: Fetch User from DB

```js
req.user = await User.findById(decoded.id).select('-password');
```
- Uses the `id` from the token payload to look up the full user document.
- `.select('-password')` tells Mongoose to exclude the `password` (hashed) field from the result — never expose the hash to controllers or responses.
- The fetched user is attached to `req.user` so all downstream controllers can use it without making another DB call.

---

## Step 5: Pass Control

```js
next();
```
- Calls the next middleware or route handler in the chain (e.g. the `createLostReport` controller).

---

## Catch Block

```js
} catch (error) {
  return res.status(401).json({ message: 'Not authorized — invalid token' });
}
```
- Catches any error from `jwt.verify()` (expired, malformed, wrong signature) and returns 401.

---

## How it's Used in Routes

```js
// lostRoutes.js
router.post('/', protect, createLostReport);
//            ↑ protect runs first, then createLostReport
```
- `protect` is passed as a middleware before the controller function.
- If `protect` calls `next()`, Express moves to `createLostReport`.
- If `protect` returns a 401, `createLostReport` never runs.
