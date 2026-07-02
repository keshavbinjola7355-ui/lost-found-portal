# controllers/reportController.js — Line-by-Line Code Explanation

**File Location:** `backend/controllers/reportController.js`  
**Role:** Provides three endpoints that power the two most-used frontend pages: `Home.jsx` (combined feed + stats) and `MyReport.jsx` (personal reports). It queries both `LostReport` and `FoundReport` collections simultaneously.

---

## getCombinedFeed — GET /api/reports

This is the **most important endpoint** — called by `Home.jsx` on mount to populate the main campus listing.

```js
const [lostReports, foundReports] = await Promise.all([
  LostReport.find(sharedFilter)...,
  FoundReport.find(sharedFilter)...,
]);
```
- `Promise.all([...])` runs both database queries **in parallel** instead of sequentially. This roughly halves the response time.

### Normalisation

```js
const normalizedLost = lostReports.map((r) => ({
  id: r._id.toString(),
  title: r.itemName,
  ...
  type: 'lost',
  timestamp: r.createdAt.getTime(),
}));
```
- Both collections are "normalised" into a **common shape** that the frontend `Home.jsx` expects.
- `r._id.toString()` converts the MongoDB ObjectId to a plain string (React keys and comparisons need strings).
- `r.date.toLocaleDateString(...)` formats the date the same way the frontend was doing it previously with `Date.toLocaleDateString()`.
- `timestamp: r.createdAt.getTime()` — milliseconds since epoch, used for sorting.

```js
const combined = [...normalizedLost, ...normalizedFound].sort(
  (a, b) => b.timestamp - a.timestamp
);
```
- Merges both arrays and sorts the combined list by timestamp descending (newest first). Mirrors what `Home.jsx` was doing with localStorage data.

---

## getStats — GET /api/reports/stats

```js
const [activeLost, activeFound, resolvedLost, resolvedFound] = await Promise.all([
  LostReport.countDocuments({ status: { $ne: 'resolved' } }),
  FoundReport.countDocuments({ status: { $ne: 'resolved' } }),
  LostReport.countDocuments({ status: 'resolved' }),
  FoundReport.countDocuments({ status: 'resolved' }),
]);
```
- Four `.countDocuments()` queries run in parallel.
- `{ $ne: 'resolved' }` — MongoDB operator for "not equal". Counts documents where status is NOT resolved.
- Returns counts that match the three stat boxes in `Home.jsx`:
  - `totalLost` ← `activeLost`
  - `totalFound` ← `activeFound`
  - `totalResolved` ← `resolvedLost + resolvedFound`

---

## getMyReports — GET /api/reports/my (Protected)

```js
const userId = req.user._id;
const [myLost, myFound] = await Promise.all([
  LostReport.find({ userId }).sort({ createdAt: -1 }),
  FoundReport.find({ userId }).sort({ createdAt: -1 }),
]);
```
- `req.user._id` is set by the `protect` middleware — no need to pass userId in the request.
- Filters both collections by the logged-in user's ID.
- Returns a combined, sorted list of the user's own reports for `MyReport.jsx`.

---

## Why is this in a Separate Controller?

`lostController` and `foundController` handle single-collection operations. `reportController` exists for **cross-collection** operations where we need to query and merge data from both `LostReport` and `FoundReport` simultaneously. Keeping them separate follows the Single Responsibility Principle.

---

## Frontend Endpoint Map

| Frontend Component | API Call | Controller Function |
|--------------------|----------|---------------------|
| `Home.jsx` on load | `GET /api/reports` | `getCombinedFeed` |
| `Home.jsx` stats row | `GET /api/reports/stats` | `getStats` |
| `MyReport.jsx` on load | `GET /api/reports/my` | `getMyReports` |
