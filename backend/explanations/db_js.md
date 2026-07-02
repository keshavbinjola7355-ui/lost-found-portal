# config/db.js — Line-by-Line Code Explanation

**File Location:** `backend/config/db.js`  
**Role:** Contains the single function `connectDB()` that opens a connection from the Node.js process to the MongoDB database. Kept in its own file so both `server.js` and any future test setup can import it cleanly.

---

## Import

```js
import mongoose from 'mongoose';
```
- Mongoose is the ODM (Object Data Modelling) library for MongoDB. It lets us define schemas, create models, and query the database using JavaScript objects instead of raw BSON.

---

## connectDB Function

```js
const connectDB = async () => {
```
- `async` because `mongoose.connect()` returns a Promise (network call to MongoDB).

```js
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
```
- `process.env.MONGO_URI` is loaded from `.env` (value: `mongodb://127.0.0.1:27017/lost_found` locally).
- `mongoose.connect()` returns a connection object. We store it in `conn` to log the host name.
- The URI `lost_found` at the end is the database name. MongoDB creates it automatically on first use.

```js
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
```
- Logs the host (e.g. `127.0.0.1`) so we can confirm which server was connected to.

```js
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
```
- If the connection fails (wrong URI, MongoDB not running, network issue), we print the error message and call `process.exit(1)`.
- Exit code `1` signals failure to the operating system or process manager (like PM2). This prevents the API from running with no database — which would cause every request to fail silently.

---

## Export

```js
export default connectDB;
```
- Named export so `server.js` can import it as `import connectDB from './config/db.js'`.

---

## Why a Separate File?

Keeping DB connection logic in `config/db.js` instead of inline in `server.js` follows the **Separation of Concerns** principle:
- `server.js` = startup orchestration  
- `config/db.js` = infrastructure configuration  
- `app.js` = HTTP logic

This also makes it easy to mock the DB connection in unit tests.
