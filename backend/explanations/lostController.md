# controllers/lostController.js — Line-by-Line Code Explanation

**File Location:** `backend/controllers/lostController.js`  
**Role:** Contains all CRUD (Create, Read, Update, Delete) operations for lost item reports. Replaces the `localStorage.setItem('lost-reports', ...)` pattern in `ReportLost.jsx` with a real MongoDB database.

---

## getLostReports — GET /api/lost

```js
const { category, status, q } = req.query;
```
- Reads optional filter parameters from the URL query string.
- Example: `GET /api/lost?category=electronics&q=macbook`

```js
const filter = {};
if (category && category !== 'all') filter.category = category;
if (status && status !== 'all') filter.status = status;
if (q) {
  const regex = new RegExp(q, 'i');
  filter.$or = [{ itemName: regex }, { location: regex }, { description: regex }];
}
```
- **Dynamic filter**: builds the MongoDB query object only with the filters that were provided.
- `new RegExp(q, 'i')` — creates a case-insensitive regex. Allows searching "macbook" to match "MacBook Pro".
- `$or` — MongoDB operator matching any of the listed conditions.

```js
const reports = await LostReport.find(filter)
  .populate('userId', 'name rollNo')
  .sort({ createdAt: -1 });
```
- `.populate('userId', 'name rollNo')` — replaces the `userId` ObjectId with the actual user's name and roll number.
- `.sort({ createdAt: -1 })` — descending order (newest first). `-1` = descending.

---

## getLostReportById — GET /api/lost/:id

```js
const report = await LostReport.findById(req.params.id)...
if (!report) { res.status(404); throw new Error('Lost report not found'); }
```
- `req.params.id` is the MongoDB ObjectId from the URL (e.g. `/api/lost/64a1b...`).
- If no document found, sets 404 status and throws an error — caught by `next(error)` in the catch block.

---

## createLostReport — POST /api/lost (Protected)

```js
const report = await LostReport.create({
  ...
  date: new Date(date),
  userId: req.user._id,
  status: 'searching',
});
```
- `new Date(date)` — converts the ISO date string from the frontend form to a JavaScript `Date` object for MongoDB.
- `req.user._id` — set by the `protect` middleware. This ties the report to the logged-in user.
- `status: 'searching'` — hardcoded default, user can't set an initial status.

```js
res.status(201).json(report);
```
- `201 Created` is the semantically correct status for resource creation.

---

## updateLostReport — PUT /api/lost/:id (Protected)

```js
if (report.userId.toString() !== req.user._id.toString()) {
  res.status(403);
  throw new Error('You are not authorized to update this report');
}
```
- **Ownership check**: MongoDB ObjectIds are objects, not strings. We convert both to strings with `.toString()` before comparing.
- `403 Forbidden` — the user is authenticated but not allowed to modify this specific resource (it belongs to someone else).

```js
const allowedFields = ['itemName', 'category', ...];
allowedFields.forEach((field) => {
  if (req.body[field] !== undefined) report[field] = req.body[field];
});
const updatedReport = await report.save();
```
- **Whitelist approach**: only specific fields can be changed. This prevents users from changing `userId` or `status` through sneaky body injection.
- `report.save()` triggers the pre-save hook again (but password hook won't run since this isn't a User model).

---

## deleteLostReport — DELETE /api/lost/:id (Protected)

```js
await report.deleteOne();
res.json({ message: 'Lost report deleted successfully', id: req.params.id });
```
- `deleteOne()` removes the document from MongoDB permanently.
- Returns `200 OK` with a confirmation message (not `204 No Content`, since we want to return the deleted ID).

---

## Error Flow Pattern (used in all functions)

```js
try {
  // DB operations
} catch (error) {
  next(error); // Forward to global errorHandler
}
```
- Every controller wraps logic in `try/catch`. Any error (DB error, thrown error) is forwarded to the global `errorHandler` middleware via `next(error)`.
