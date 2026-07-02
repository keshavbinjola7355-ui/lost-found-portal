# middleware/errorMiddleware.js — Line-by-Line Code Explanation

**File Location:** `backend/middleware/errorMiddleware.js`  
**Role:** Provides two middleware functions that create a consistent, safe error response system for the entire API.

---

## Why a Global Error Handler?

Without it, you'd need a try/catch in every controller and duplicate error-response code everywhere. With it, any controller just calls `next(error)` and the global handler formats it uniformly.

---

## notFound Middleware

```js
export const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found — ${req.originalUrl}`);
  res.status(404);
  next(error);
};
```

- This middleware runs when **no other route matched** the incoming request.
- `req.originalUrl` gives the exact path the user requested (e.g. `/api/typo`).
- It sets the response status to `404` and creates a new `Error` object.
- Passing the error to `next(error)` hands it off to `errorHandler` below.
- **Location in app.js**: Registered after all route declarations so it only catches unmatched paths.

---

## errorHandler Middleware

```js
export const errorHandler = (err, req, res, next) => {
```
- Express identifies a function as an error handler when it has **exactly 4 parameters**: `(err, req, res, next)`.
- The first argument `err` receives whatever was passed to `next(error)` from any controller or middleware in the app.

```js
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
```
- By default, `res.statusCode` starts at `200`.
- If a controller sets `res.status(400)` or `res.status(404)` before throwing an error, we preserve that status code.
- If no status code was set (it's still `200`), we use `500` (Internal Server Error) to indicate something unexpected went wrong.

```js
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
```
- Responds with a consistent JSON structure:
  - `message` — The human-readable error (e.g. "Item name is required").
  - `stack` — The JavaScript stack trace. **Shown only in development** (`NODE_ENV !== 'production'`). In production, it's `null` to prevent leaking internal code paths to attackers.

---

## How Controllers Use This System

```js
// In lostController.js
export const createLostReport = async (req, res, next) => {
  try {
    if (!itemName) {
      res.status(400);              // Step 1: Set status code
      throw new Error('Item name is required');  // Step 2: Create error
    }
    // ...
  } catch (error) {
    next(error);  // Step 3: Forward to errorHandler
  }
};
```

Flow: `controller throws` → `catch block calls next(error)` → `errorHandler formats response`.

---

## Consistent Error Envelope

Every API error, whether a 400 validation failure or a 500 server crash, returns the same shape:

```json
{
  "message": "Human readable error description",
  "stack": "Error: ...\n    at ..."
}
```
