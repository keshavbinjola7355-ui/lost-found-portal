# controllers/foundController.js — Line-by-Line Code Explanation

**File Location:** `backend/controllers/foundController.js`  
**Role:** Contains all CRUD operations for found item reports. Mirrors `lostController.js` in structure but handles the unique fields of `ReportFound.jsx` — particularly `collectedLocation`.

---

## Structure

`foundController.js` is architecturally identical to `lostController.js`. All five functions follow the same pattern:

1. `getFoundReports` — GET /api/found (public, filterable)
2. `getFoundReportById` — GET /api/found/:id (public)
3. `createFoundReport` — POST /api/found (protected)
4. `updateFoundReport` — PUT /api/found/:id (protected + owner only)
5. `deleteFoundReport` — DELETE /api/found/:id (protected + owner only)

> For shared patterns (dynamic filters, ownership checks, `next(error)` pattern), see `lostController.md`.

---

## Key Differences from lostController

### createFoundReport

```js
const report = await FoundReport.create({
  ...
  collectedLocation: collectedLocation || 'with-finder',
  status: 'matched',  // ← different from 'searching' in lost reports
});
```

- **`collectedLocation`**: Unique to found reports. Where the item currently is:
  - `'with-finder'` — the person who found it still has it.
  - `'turned-in-security'` — deposited at Campus Security.
  - `'turned-in-dept'` — deposited at a department office.
- **`status: 'matched'`**: Found reports are immediately visible to item searchers, so they start as `'matched'` (not `'searching'`).

### updateFoundReport — Allowed Fields

```js
const allowedFields = [
  'itemName', 'category', 'location', 'date', 'description',
  'collectedLocation', 'contactPhone', 'status',
];
```
- Includes `collectedLocation` (since a finder might hand in the item later).
- Does NOT include `hasReward` or `rewardAmount` (those only exist on lost reports).

---

## Status Lifecycle Comparison

```
Lost Report:   searching → matched → resolved
Found Report:             matched → resolved
```

Found reports skip `'searching'` because the item has already been found.

---

## Frontend Mapping

| ReportFound.jsx Action | Controller Endpoint |
|------------------------|---------------------|
| Form submit | `createFoundReport` POST /api/found |
| Navigate to `/myreports` | `getMyReports` in reportController.js |
| Home.jsx loads feed | `getFoundReports` GET /api/found |
