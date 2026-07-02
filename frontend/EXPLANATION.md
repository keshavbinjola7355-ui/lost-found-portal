# Technical Documentation — College Lost & Found Pages

This document explains the architecture, React state bindings, lifecycle methods, hooks, styling, and data flows of each page in the portal.

---

## 1. Landing Dashboard (`Home.jsx`)
**File Path**: `src/pages/Home.jsx`
**Associated Styles**: `src/style/Home.css`

### Purpose
Serves as the main campus landing page. It displays stats of lost and found items, provides quick-navigation links, renders a live search feed of active posts, and supports a glassmorphic details modal overlay for item claims.

### Key Working Mechanics
1. **Dynamic Loading & Merging (`useEffect`)**:
   When the page mounts, it reads two arrays from the browser's local storage: `lost-reports` and `found-reports`. It normalizes their structures (mapping properties like `itemName` to a standard listing `title`), merges them into a single list, and sorts them by their numeric creation `timestamp` (newest posts first).
2. **Fallback Mock Data**:
   If a user visits the site with empty storage, the component initializes with high-fidelity pre-defined mockup data so the dashboard is visually populated.
3. **Live Search and Filters**:
   It filters the combined array on every keystroke or selection:
   - **Text Query (`searchQuery`)**: Checks for substring matches inside titles, locations, and descriptions.
   - **Category (`categoryFilter`)**: Filters by keys like `electronics`, `keys`, `documents`, `books`, `clothing`, or `other`.
   - **Type (`typeFilter`)**: Restricts cards to only `lost` or `found` reports.
4. **Dynamic Detail Modal (`selectedItem`)**:
   Clicking the **"View Details"** button on an item card sets the `selectedItem` state. When this state is not `null`, a glassmorphic overlay portal renders on top of the DOM with blur effects (`backdrop-filter: blur(8px)`). It shows description fields, conditional reward information, current pickup locations, and a direct telephone call linkage.

---

## 2. Report Lost Belonging Form (`ReportLost.jsx`)
**File Path**: `src/pages/ReportLost.jsx`
**Associated Styles**: `src/style/ReportForm.css`

### Purpose
Allows users to file an active report for an item they misplaced on campus.

### Key Working Mechanics
1. **Single-State Object Bindings**:
   Rather than maintaining individual state hook handlers for 8 different form fields, the page uses one unified state object:
   ```javascript
   const [formData, setFormData] = useState({
     itemName: "",
     category: "",
     location: "",
     date: "",
     description: "",
     hasReward: false,
     rewardAmount: "",
     contactPhone: "",
   });
   ```
2. **Generic Change Handler (`handleChange`)**:
   A single change listener handles updates for all text inputs, textareas, selects, and checkbox switches by reading the name and value of the source HTML tag:
   ```javascript
   const handleChange = (e) => {
     const { name, value, type, checked } = e.target;
     setFormData((prev) => ({
       ...prev,
       [name]: type === "checkbox" ? checked : value,
     }));
   };
   ```
3. **Autofill Hook (`useEffect`)**:
   On load, it attempts to fetch a logged-in profile key (`college-user`). If found, it extracts their registered phone number and fills the `contactPhone` state automatically.
4. **Local Storage Persistence (`handleSubmit`)**:
   Upon clicking submit:
   - Prevents default browser reload behavior (`e.preventDefault()`).
   - Normalizes dates into user-friendly strings.
   - Prepends the item to the `lost-reports` array in `localStorage`.
   - Sets the state `isSubmitted` to `true`, switching the UI to render the completion card.

---

## 3. Report Found Belonging Form (`ReportFound.jsx`)
**File Path**: `src/pages/ReportFound.jsx`
**Associated Styles**: `src/style/ReportForm.css`

### Purpose
Enables honesty filings when a member of the campus finds a misplaced item.

### Key Working Mechanics
1. **Symmetric Layout**:
   Shares structural form layout and classes with `ReportLost.jsx` to reduce layout weight and maintain style coherence.
2. **Pickup Station Handling (`collectedLocation`)**:
   Features a dedicated drop-down state tracking where the found item is currently held:
   - `with-finder`: The finder has the item and must be contacted.
   - `turned-in-security`: Turned in at the main Security Desk.
   - `turned-in-dept`: Handed in to a specific department block office.
3. **State Storage Location**:
   Upon submit, it saves the record inside the `found-reports` local storage key rather than `lost-reports` so that the main feed correctly labels the item as **Found** (emerald green status card).

---

## 4. Header Bar Shell (`Header.jsx`)
**File Path**: `src/components/Header.jsx`
**Associated Styles**: `src/style/Header.css`

### Purpose
Renders navigation tabs, branding elements, and authentication states at the top of the browser screen.

### Key Working Mechanics
1. **Active Route Highlighter (`useLocation`)**:
   By invoking `useLocation` from `react-router-dom`, the component gets the active path string (`location.pathname`). It executes an inline comparison to add the `.active` CSS class to the matching tab container:
   ```javascript
   const isActive = (path) => location.pathname === path;
   ```
2. **Dynamic Authentication State**:
   Reads `college-user` profile data from storage. If a user is registered/logged in, it shows their first name in the top right. Otherwise, it defaults to displaying "Keshav" or "Guest".
3. **Logout Routing**:
   The logout action clears registered keys and redirects navigation back to the `/login` route.
