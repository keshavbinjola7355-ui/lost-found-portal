# routes/foundRoutes.js — Line-by-Line Code Explanation

**File Location:** `backend/routes/foundRoutes.js`  
**Role:** Maps URL patterns for found-report endpoints to their controller functions. Structurally identical to `lostRoutes.js` — see `lostRoutes.md` for detailed explanations of the shared patterns.

---

## Routes Summary

| Method | Endpoint | Auth | Controller |
|--------|----------|------|------------|
| GET | `/api/found` | Public | `getFoundReports` |
| POST | `/api/found` | Protected | `createFoundReport` |
| GET | `/api/found/:id` | Public | `getFoundReportById` |
| PUT | `/api/found/:id` | Protected + Owner | `updateFoundReport` |
| DELETE | `/api/found/:id` | Protected + Owner | `deleteFoundReport` |

---

## Design Notes

- The route file is intentionally minimal ("thin routes"). All logic lives in the controller.
- Public GET routes allow anyone to browse found items and contact finders, even without an account — this is deliberate campus-portal UX.
- The `protect` middleware on POST/PUT/DELETE ensures only authenticated students can modify data.
