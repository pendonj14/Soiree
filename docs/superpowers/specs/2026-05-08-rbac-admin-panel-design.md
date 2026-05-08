# RBAC + Admin Panel — Design Spec
Date: 2026-05-08

## Overview

Add role-based access control to the SOIRÉE app. Regular users access the existing site unchanged. Admin users are routed exclusively to a new admin panel with two sections: reservation management (default landing) and menu CMS.

---

## 1. Data Model Changes

### User model (`backend/src/models/user.model.js`)
Add one field:
```js
role: { type: String, enum: ['user', 'admin'], default: 'user' }
```
All existing users automatically get `role: 'user'`. First admin is created via a seed script (`backend/src/scripts/seed-admin.js`) or by updating the document directly in MongoDB Atlas.

### Reservation model (`backend/src/models/reservation.model.js`)
Add one field:
```js
status: {
  type: String,
  enum: ['pending', 'accepted', 'rejected', 'done'],
  default: 'pending'
}
```
All new reservations start as `pending`.

**Status lifecycle:**
```
pending → accepted → done → [deleted]
pending → rejected       (no further transitions)
```
Deletion is only permitted when `status === 'done'`.

### JWT payload
Add `role` to the signed payload so middleware can check it without a DB round-trip:
```js
jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, ...)
```
The login/register response `user` object also includes `role` so the frontend can redirect immediately.

---

## 2. Backend

### New files

**`backend/src/middleware/admin.middleware.js`**
Chains after the existing `protect` middleware. Reads `req.user.role` and returns `403 Forbidden` if it is not `'admin'`.

**`backend/src/routes/admin.route.js`**
All routes protected by `protect` + `adminOnly`.

**`backend/src/controllers/admin.controllers.js`**

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/reservations` | All reservations, populated with user details |
| `PATCH` | `/api/admin/reservations/:id/status` | Body: `{ status }` — accepts `accepted`, `rejected`, `done` |
| `DELETE` | `/api/admin/reservations/:id` | Returns 400 if status is not `done` |
| `DELETE` | `/api/admin/reservations/done/all` | Bulk-deletes all reservations with `status === 'done'` |
| `GET` | `/api/admin/menu` | All menu items |
| `POST` | `/api/admin/menu` | Create menu item (Cloudinary upload via Multer) |
| `PATCH` | `/api/admin/menu/:id` | Update menu item fields |
| `DELETE` | `/api/admin/menu/:id` | Delete menu item |

**`backend/src/scripts/seed-admin.js`**
One-time script to promote an existing user to admin by email. Run with:
```bash
node backend/src/scripts/seed-admin.js admin@example.com
```

### Modified files

**`backend/src/controllers/user.controllers.js`**
- Add `role: user.role` to JWT payload in both `login` and `register`
- Add `role` to the `user` object in the response body

**`backend/src/routes/menu.route.js`**
- `GET /api/menu/all` — stays public (frontend menu page uses it)
- `POST /create`, `PATCH /update/:id`, `DELETE /delete/:id` — add `protect` + `adminOnly` middleware (currently unprotected — security gap)

**`backend/src/app.js`**
- Mount admin routes: `app.use('/api/admin', adminRouter)`

---

## 3. Frontend

### New files

**`frontend/src/components/AdminRoute.jsx`**
Route guard: redirects unauthenticated users to `/`, redirects authenticated non-admins to `/`.

**`frontend/src/pages/admin/AdminLayout.jsx`**
Icon sidebar layout with `<Outlet />`:
- Top: branded `S` mark
- Calendar icon → `/admin/reservations` (active = filled cream icon)
- Menu/list icon → `/admin/menu`
- Bottom: logout icon (calls existing `authService.logout`, clears localStorage, redirects to `/`)

**`frontend/src/pages/admin/ReservationsPage.jsx`**
- Default active filter on load: **Pending**
- Filter pill order: Pending → Accepted → Rejected → Done → All
- **Done tab only**: "Delete All" button (top-right of filter row) — calls bulk-delete endpoint with a confirmation prompt
- Row actions by status:
  - `pending` → Accept + Reject buttons
  - `accepted` → Mark Done button
  - `rejected` → no actions
  - `done` → Delete button

**`frontend/src/pages/admin/MenuManagementPage.jsx`**
- Grid of existing menu items (name, price, image, category)
- Each card has Edit and Delete buttons
- "Add Item" button opens an inline form or modal: name, price, description, category, image upload
- Image upload uses existing Cloudinary flow (Multer on backend)

**`frontend/src/services/adminService.js`**
All admin API calls, reading `VITE_API_URL` + `/admin/...` prefix. Attaches `Authorization: Bearer <token>` header from localStorage.

### Modified files

**`frontend/src/App.jsx`**
```jsx
// New admin route tree
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Navigate to="/admin/reservations" replace />} />
    <Route path="reservations" element={<ReservationsPage />} />
    <Route path="menu" element={<MenuManagementPage />} />
  </Route>
</Route>
```
On login, if `user.role === 'admin'`, navigate to `/admin/reservations` instead of letting the user stay on the regular site.

**`frontend/src/context/AuthContext.jsx`**
No structural change needed. `role` comes back in the `soiree_user` object stored in localStorage and is already available via `useAuth()`. The login handler adds a role-aware redirect.

---

## 4. Auth Flow Summary

```
Login
  └─ role === 'admin'  → navigate('/admin/reservations')
  └─ role === 'user'   → stay on current page (existing behaviour)

Route /admin/*
  └─ not logged in     → redirect to /
  └─ logged in, non-admin → redirect to /
  └─ logged in, admin  → render AdminLayout

Route / (regular pages)
  └─ logged in, admin  → redirect to /admin/reservations
```

---

## 5. Real-Time Events (Socket.IO)

**Library:** Socket.IO — chosen over raw `ws` for built-in room support (needed for user-specific delivery) and automatic reconnection. No Redis needed at 5–10 concurrent users; in-memory is sufficient.

**Install:**
```bash
npm install socket.io          # backend (root)
npm install socket.io-client   # frontend
```

### Server setup (`backend/src/index.js`)
Wrap the existing Express `app` with an `http.Server`, then attach Socket.IO to it. The existing `app.listen()` call is replaced with `httpServer.listen()`.

```js
import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer(app);
const io = new io.Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] }
});
```

The `io` instance is stored in `app.locals.io` so controllers can emit without importing from a separate module.

### Rooms

| Room | Members | Purpose |
|------|---------|---------|
| `admins` | All connected admin sockets | Broadcast new reservations and status changes to all admins |
| `user:<userId>` | The socket of that specific user | Deliver personal status-change events to the right user |

On connect, the client sends a `join` event with its JWT. The server verifies the token, then joins the socket to `admins` (if admin) or `user:<id>` (if regular user). Unauthenticated connections are disconnected immediately.

### Events

| Event name | Direction | Payload | Trigger |
|-----------|-----------|---------|---------|
| `reservation:new` | server → `admins` room | full reservation object with user details | user creates a reservation |
| `reservation:status_changed` | server → `admins` room + `user:<id>` room | `{ reservationId, status }` | admin updates status |
| `reservation:deleted` | server → `admins` room | `{ reservationId }` | admin deletes a single reservation |
| `reservation:deleted_all_done` | server → `admins` room | — | admin bulk-deletes all done reservations |

### Emitting from controllers
After each DB write in `admin.controllers.js` and `reservation.controllers.js`, emit the relevant event via `req.app.locals.io`.

### Frontend (`frontend/src/hooks/useSocket.js`)
New hook that:
1. Creates a Socket.IO client connection on mount, sends `join` with the stored JWT
2. Registers the 4 event listeners and dispatches updates into local React state
3. Disconnects on unmount

**`ReservationsPage.jsx`** uses `useSocket` to keep the reservation list in sync without polling. When `reservation:new` arrives, the new row is prepended to the pending list. When `reservation:status_changed` arrives, the matching row updates in place.

**User-facing pages** (e.g. `ReservationPage.jsx`) use `useSocket` to listen for `reservation:status_changed` events scoped to their own user ID — they can show a toast or update reservation status in the UI without a page refresh.

### Concurrent request handling
Node.js handles 5–10 concurrent users natively via its non-blocking event loop. No thread pools or worker processes are needed. Socket.IO connections are kept alive via long-lived WebSocket upgrades; Express handles the REST API calls concurrently as usual.

---

## 6. Out of Scope

- Admin cannot manage users (promote/demote roles)
- No analytics or dashboard summary cards
- No email notifications to guests on status change
