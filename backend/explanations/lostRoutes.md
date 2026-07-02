# routes/lostRoutes.js — Line-by-Line Code Explanation

**File Location:** `backend/routes/lostRoutes.js`  
**Role:** Maps URL patterns for lost-report endpoints to their controller functions. Uses the Express Router's `.route()` chaining syntax to group methods for the same path.

---

## router.route() Syntax

```js
router.route('/')
  .get(getLostReports)
  .post(protect, createLostReport);
```

This is equivalent to writing:
```js
router.get('/', getLostReports);
router.post('/', protect, createLostReport);
```

The `.route()` chaining is cleaner when multiple HTTP methods apply to the same path — it avoids repeating the path string.

---

## Collection-Level Routes (no `:id`)

```js
router.route('/')
  .get(getLostReports)               // Public — no auth
  .post(protect, createLostReport);  // Protected — JWT required
```

| Method | Who Can Use | What It Does |
|--------|-------------|--------------|
| GET | Anyone | Returns all lost reports (filterable) |
| POST | Logged-in users only | Creates a new lost report |

---

## Document-Level Routes (with `:id`)

```js
router.route('/:id')
  .get(getLostReportById)
  .put(protect, updateLostReport)
  .delete(protect, deleteLostReport);
```

- `:id` is a **URL parameter** — Express captures whatever comes after `/` and puts it in `req.params.id`.
- Example: `GET /api/lost/64a1b2c3d4e5f...` → `req.params.id = '64a1b2c3d4e5f...'`

| Method | Who Can Use | What It Does |
|--------|-------------|--------------|
| GET | Anyone | Returns one report by ID |
| PUT | Owner only | Updates the report (ownership checked in controller) |
| DELETE | Owner only | Deletes the report |

---

## Security Design

Read operations (GET) are intentionally public — campus members should be able to browse all lost/found reports without logging in, just like a physical lost-and-found board.

Write operations (POST, PUT, DELETE) require a JWT — so only verified students can create or modify reports.

Ownership enforcement (can only edit/delete your own reports) is handled inside the controllers, not in the routes — keeping routes thin and controllers responsible for business logic.
