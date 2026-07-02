# routes/reportRoutes.js — Line-by-Line Code Explanation

**File Location:** `backend/routes/reportRoutes.js`  
**Role:** Provides the combined-feed, stats, and personal-report endpoints used by `Home.jsx` and `MyReport.jsx`. Unlike `lostRoutes` and `foundRoutes`, all endpoints here are GET-only.

---

## Critical Ordering Rule

```js
router.get('/', getCombinedFeed);
router.get('/stats', getStats);    // ← Must be before /:id
router.get('/my', protect, getMyReports); // ← Must be before /:id
```

**Why does order matter here?**

Express matches routes top-to-bottom in the order they're defined. If we had:

```js
router.get('/:id', someHandler); // hypothetical
router.get('/stats', getStats);  // NEVER REACHED — 'stats' matches /:id first!
```

By defining `/stats` and `/my` **before** any `/:id` route, we ensure "stats" and "my" are treated as literal strings, not as dynamic `:id` parameters.

---

## Routes Summary

| Method | Endpoint | Auth | Frontend Consumer |
|--------|----------|------|-------------------|
| GET | `/api/reports` | Public | `Home.jsx` - main listing |
| GET | `/api/reports/stats` | Public | `Home.jsx` - stats boxes |
| GET | `/api/reports/my` | Protected | `MyReport.jsx` - personal list |

---

## Why Separate from lostRoutes/foundRoutes?

- `lostRoutes` / `foundRoutes` = single-collection CRUD.
- `reportRoutes` = cross-collection queries (merging two MongoDB collections).

Separating them keeps each file focused on one responsibility and makes it easy to add future combined queries (e.g., `/api/reports/search?q=...`) without bloating the single-collection routers.
