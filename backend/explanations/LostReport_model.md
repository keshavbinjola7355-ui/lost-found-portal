# models/LostReport.js — Line-by-Line Code Explanation

**File Location:** `backend/models/LostReport.js`  
**Role:** Defines the MongoDB schema for a "lost item" report. Every field directly maps to a form input in `frontend/src/pages/ReportLost.jsx`.

---

## Schema Fields

```js
itemName: { type: String, required: true, trim: true }
```
- The name of the lost item (e.g. "MacBook Pro", "Black Wallet").
- `trim: true` strips whitespace from both ends of the string before saving.

```js
category: {
  type: String,
  required: true,
  enum: ['electronics', 'keys', 'documents', 'books', 'clothing', 'other']
}
```
- `enum` restricts the value to the exact same options shown in the `<select>` dropdown in `ReportLost.jsx`.
- MongoDB will reject any value not in this list.

```js
location: { type: String, required: true, trim: true }
```
- The last known location of the item (e.g. "Library Study Room 402").

```js
date: { type: Date, required: true }
```
- Stored as a `Date` object in MongoDB for accurate sorting/querying.
- In the controller, we convert the ISO string from the frontend: `new Date(date)`.

```js
description: { type: String, required: true, trim: true }
```
- Detailed description. Used by the Home.jsx search filter.

```js
hasReward: { type: Boolean, default: false }
```
- Toggled by the reward switch in `ReportLost.jsx`.

```js
rewardAmount: { type: String, default: '', trim: true }
```
- Description of the reward (e.g. "Free coffee"). Empty string if `hasReward` is false.

```js
contactPhone: { type: String, required: true, trim: true }
```
- Phone number auto-filled from the user's profile in the frontend.

```js
status: {
  type: String,
  enum: ['searching', 'matched', 'resolved'],
  default: 'searching'
}
```
- **`searching`** — Active, still looking for the item.
- **`matched`** — A matching found report exists.
- **`resolved`** — Item returned to owner.
- Defaults to `'searching'` on creation.

```js
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
}
```
- A reference (foreign key) to the `User` who filed this report.
- `ref: 'User'` enables Mongoose `.populate('userId')` which substitutes the ObjectId with the full User document when querying.

```js
{ timestamps: true }
```
- Adds `createdAt` and `updatedAt`. `createdAt` is used for sorting the combined feed in `reportController.js`.

---

## Frontend ↔ Backend Field Mapping

| ReportLost.jsx `formData` key | LostReport Model field |
|-------------------------------|------------------------|
| `itemName` | `itemName` |
| `category` | `category` |
| `location` | `location` |
| `date` | `date` |
| `description` | `description` |
| `hasReward` | `hasReward` |
| `rewardAmount` | `rewardAmount` |
| `contactPhone` | `contactPhone` |
| (auto) | `status: 'searching'` |
| (JWT user) | `userId` |
