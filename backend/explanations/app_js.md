# app.js — Line-by-Line Code Explanation

**File Location:** `backend/app.js`  
**Role:** The heart of the Express application. Assembles all middleware, CORS, routes, and error handlers into a single `app` object that is exported and used by `server.js`.

---

## Imports (Lines 1–13)

```js
import express from 'express';
```
- Imports the Express framework. `express()` creates the app instance.

```js
import dotenv from 'dotenv';
```
- Imports the dotenv package. Allows `process.env.VAR` to read values from `.env`.

```js
import cookieParser from 'cookie-parser';
```
- Middleware that parses the `Cookie` HTTP header and populates `req.cookies`. Needed so the `protect` middleware can read the JWT stored in an HttpOnly cookie.

```js
import authRoutes from './routes/authRoutes.js';
import lostRoutes from './routes/lostRoutes.js';
import foundRoutes from './routes/foundRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
```
- Each route file is an `express.Router()` instance. Importing them here lets us mount them under specific URL prefixes.

```js
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
```
- Two error-handling middleware functions (explained in their own file). Must be registered last.

---

## App Creation (Line 17)

```js
const app = express();
```
- Creates the main Express application object. All middleware and routes are attached to this.

---

## Global Middleware (Lines 20–30)

```js
app.use(express.json());
```
- Parses incoming requests with JSON payloads. Without this, `req.body` would be `undefined` for POST/PUT requests.

```js
app.use(express.urlencoded({ extended: true }));
```
- Parses URL-encoded bodies (e.g. classic HTML form submissions). `extended: true` allows rich objects and arrays.

```js
app.use(cookieParser());
```
- Reads cookies from the `Cookie` header and makes them available as `req.cookies`. Used by the JWT protect middleware.

---

## CORS Middleware (Lines 33–55)

```js
app.use((req, res, next) => { ... });
```
- Custom CORS (Cross-Origin Resource Sharing) middleware instead of the `cors` npm package. This gives explicit control over which origins, methods, and headers are allowed.

```js
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];
```
- Vite (port 5173) and CRA/Next.js (port 3000) are the allowed frontend origins during development. In production, replace with your deployed frontend URL.

```js
res.setHeader('Access-Control-Allow-Credentials', 'true');
```
- Critical: allows the browser to send/receive cookies (the JWT HttpOnly cookie) in cross-origin requests.

```js
if (req.method === 'OPTIONS') return res.sendStatus(204);
```
- Handles "preflight" requests. Browsers send an OPTIONS request before any cross-origin POST/PUT/DELETE to check if it's allowed. We respond immediately with 204 (No Content).

---

## Health Check Route (Lines 58–65)

```js
app.get('/api/health', (req, res) => { ... });
```
- A simple endpoint that confirms the server is alive. Useful for cloud deployment health checks (e.g. Render, Railway) and local testing.

---

## Route Mounting (Lines 68–73)

```js
app.use('/api/auth', authRoutes);
```
- All requests starting with `/api/auth` are handled by `authRoutes`. Example: `POST /api/auth/register` → runs the `register` controller.

```js
app.use('/api/lost', lostRoutes);
app.use('/api/found', foundRoutes);
app.use('/api/reports', reportRoutes);
```
- Same pattern for all other route groups.

---

## Error Handlers (Lines 76–80)

```js
app.use(notFound);
```
- Registered AFTER all valid routes. If no route matched the request, this middleware creates a 404 error and passes it to `errorHandler`.

```js
app.use(errorHandler);
```
- The global error handler. Express identifies it as an error handler because it takes 4 arguments `(err, req, res, next)`. It returns a consistent JSON error envelope.

---

## Export (Line 82)

```js
export default app;
```
- Exports the fully configured `app`. `server.js` imports this and calls `app.listen(PORT)` only after the database is connected.
