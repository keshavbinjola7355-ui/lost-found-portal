# routes/authRoutes.js — Line-by-Line Code Explanation

**File Location:** `backend/routes/authRoutes.js`  
**Role:** Defines the URL patterns for authentication endpoints and maps each HTTP method + path combination to a controller function. Mounted in `app.js` under the `/api/auth` prefix.

---

## Code Walkthrough

```js
import express from 'express';
```
- Express is needed to create the router.

```js
import { register, login, logout, getMe } from '../controllers/authController.js';
```
- Named imports of the four handler functions from the auth controller.

```js
import protect from '../middleware/authMiddleware.js';
```
- The JWT guard middleware — used to protect the `/me` route.

```js
const router = express.Router();
```
- Creates a mini Express application (a "router"). Routers are like sub-apps with their own middleware stack.

---

## Route Definitions

```js
router.post('/register', register);
```
- `POST /api/auth/register` (the `/api/auth` prefix is added in `app.js`).
- No middleware before `register` — this is a public endpoint.

```js
router.post('/login', login);
```
- `POST /api/auth/login` — public.

```js
router.post('/logout', logout);
```
- `POST /api/auth/logout` — public (clearing a cookie doesn't require a valid token).

```js
router.get('/me', protect, getMe);
```
- `GET /api/auth/me` — **protected**.
- The `protect` middleware runs first; if the JWT is valid, `getMe` runs next.
- If the token is missing or invalid, `protect` returns `401` and `getMe` never executes.

---

## Path Prefix System

```
app.use('/api/auth', authRoutes)   ← in app.js
router.get('/me', ...)              ← in authRoutes.js
                   ↓
Final URL: GET /api/auth/me
```

Express concatenates the prefix in `app.use` with the path in `router.get`.

---

## Export

```js
export default router;
```
- The router is exported as the default export and imported in `app.js`.
