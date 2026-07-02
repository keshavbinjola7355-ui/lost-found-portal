# server.js — Line-by-Line Code Explanation

**File Location:** `backend/server.js`  
**Role:** The application entry point. It is the file Node.js executes when you run `npm run dev` or `npm start`. Its only job is to connect to the database and then start the HTTP server.

---

## Imports

```js
import dotenv from 'dotenv';
dotenv.config();
```
- `dotenv.config()` reads the `.env` file and loads every key=value pair into `process.env`.
- This **must be the very first thing executed** — even before importing `app.js` — because `app.js` and `config/db.js` use `process.env` values at import-time.

```js
import app from './app.js';
```
- Imports the fully configured Express application from `app.js`. The app has all middleware and routes already attached at this point.

```js
import connectDB from './config/db.js';
```
- Imports the async database connection function.

---

## Constants

```js
const PORT = process.env.PORT || 5000;
```
- Reads the `PORT` from `.env`. Falls back to `5000` if it's not set.
- Using an environment variable lets cloud hosts (like Render, Railway, or Heroku) assign a dynamic port without changing code.

---

## startServer Function

```js
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => { ... });
};
```

This is an `async` function because `connectDB()` is asynchronous (it makes a network call to MongoDB).

**Why connect before listening?**  
If we called `app.listen()` before `connectDB()` resolved, the server would start accepting requests while the database is still connecting. Any request that hits a database query would fail immediately.

By `await`-ing `connectDB()` first, we guarantee:
1. Database is connected ✅
2. **Only then** the server starts listening ✅

---

## Console Output

```js
console.log(`🚀 Server running on http://localhost:${PORT}`);
console.log(`📡 API base: http://localhost:${PORT}/api`);
console.log(`🔍 Health: http://localhost:${PORT}/api/health`);
```
- Helpful startup messages showing where the server and API are available.

---

## startServer() Call

```js
startServer();
```
- Calls the async function. Any unhandled rejection inside `startServer` (e.g. if MongoDB connection fails) is caught inside `connectDB` which calls `process.exit(1)`.
