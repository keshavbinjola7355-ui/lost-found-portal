# models/FoundReport.js — Line-by-Line Code Explanation

**File Location:** `backend/models/FoundReport.js`  
**Role:** Defines the MongoDB schema for a "found item" report. Mirrors the form fields in `frontend/src/pages/ReportFound.jsx`.

---

## Schema Fields

```js
itemName, category, location, date, description, contactPhone
```
- Same as `LostReport` — see `LostReport_model.md` for detailed explanation of these common fields.

```js
collectedLocation: {
  type: String,
  enum: ['with-finder', 'turned-in-security', 'turned-in-dept'],
  default: 'with-finder'
}
```
- **`with-finder`** — The item is still with the person who found it. They need to be contacted directly.
- **`turned-in-security`** — The item was handed to the Campus Security Desk.
- **`turned-in-dept`** — The item was dropped at a Department or Admin Block office.
- This field is unique to `FoundReport` (lost items don't have this). It directly maps to the `<select>` dropdown in `ReportFound.jsx`.

```js
status: {
  type: String,
  enum: ['matched', 'resolved'],
  default: 'matched'
}
```
- Found reports start as `'matched'` — immediately visible to lost-item searchers.
- They don't start as `'searching'` because the item has already been located.
- When the owner claims the item, status changes to `'resolved'`.

```js
userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
```
- References the User who found and reported the item.

---

## Key Difference from LostReport

| Field | LostReport | FoundReport |
|-------|------------|-------------|
| `hasReward` | ✅ Yes | ❌ No |
| `rewardAmount` | ✅ Yes | ❌ No |
| `collectedLocation` | ❌ No | ✅ Yes |
| Default `status` | `'searching'` | `'matched'` |
| Status options | searching, matched, resolved | matched, resolved |

---

## Frontend ↔ Backend Field Mapping

| ReportFound.jsx `formData` key | FoundReport Model field |
|--------------------------------|-------------------------|
| `itemName` | `itemName` |
| `category` | `category` |
| `location` | `location` |
| `date` | `date` |
| `description` | `description` |
| `collectedLocation` | `collectedLocation` |
| `contactPhone` | `contactPhone` |
| (auto) | `status: 'matched'` |
| (JWT user) | `userId` |
