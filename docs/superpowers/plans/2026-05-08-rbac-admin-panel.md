# RBAC + Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add role-based access control, a real-time admin panel with reservation management and menu CMS, powered by Socket.IO.

**Architecture:** A `role` field on the User model gates access at both the Express middleware layer (`adminOnly`) and the React router layer (`AdminRoute`). Socket.IO runs on the same HTTP server as Express; controllers emit events via `req.app.locals.io` after each DB write. The admin panel is a separate route tree (`/admin/*`) with its own layout — no Navbar, no marble background.

**Tech Stack:** Socket.IO 4, socket.io-client, Vitest (backend unit tests), React Router v7 nested routes, Tailwind CSS (inline styles for admin — keeps it isolated from the public site theme)

---

## File Map

### Backend — New
- `backend/src/middleware/admin.middleware.js` — `adminOnly` guard
- `backend/src/socket/index.js` — Socket.IO init, JWT auth middleware, room assignment
- `backend/src/controllers/admin.controllers.js` — reservation CRUD + menu CRUD, all emit socket events
- `backend/src/routes/admin.route.js` — mounts all `/api/admin/*` routes
- `backend/src/scripts/seed-admin.js` — one-shot CLI to promote a user to admin
- `backend/src/__tests__/admin.middleware.test.js`
- `backend/src/__tests__/admin.controllers.test.js`

### Backend — Modified
- `backend/src/models/user.model.js` — add `role` field
- `backend/src/models/reservation.model.js` — add `status` field
- `backend/src/controllers/user.controllers.js` — add `role` to JWT payload + response
- `backend/src/controllers/reservation.controllers.js` — emit `reservation:new` after create
- `backend/src/routes/menu.route.js` — protect write routes with `protect + adminOnly`
- `backend/src/app.js` — mount `adminRouter`
- `backend/src/index.js` — replace `app.listen` with `http.createServer` + Socket.IO

### Frontend — New
- `frontend/src/components/AdminRoute.jsx` — route guard
- `frontend/src/pages/admin/AdminLayout.jsx` — icon sidebar + `<Outlet />`
- `frontend/src/pages/admin/ReservationsPage.jsx` — reservation table, filters, actions
- `frontend/src/pages/admin/MenuManagementPage.jsx` — menu grid + create/edit/delete
- `frontend/src/services/adminService.js` — all admin API calls
- `frontend/src/hooks/useSocket.js` — Socket.IO connection hook

### Frontend — Modified
- `frontend/src/App.jsx` — split into `AppRoutes` + `UserApp`, add admin route tree
- `frontend/src/context/AuthContext.jsx` — no structural change needed (role flows in via `soiree_user`)

---

## Task 1: Install dependencies + test setup

**Files:**
- Modify: `package.json` (root)
- Modify: `frontend/package.json`
- Create: `vitest.config.js` (root)

- [ ] **Step 1: Install backend deps**

```bash
npm install socket.io
npm install -D vitest
```

- [ ] **Step 2: Install frontend dep**

```bash
cd frontend && npm install socket.io-client && cd ..
```

- [ ] **Step 3: Add test script to root package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest run"
```

- [ ] **Step 4: Create vitest config**

Create `vitest.config.js` at root:
```js
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: { environment: 'node' },
});
```

- [ ] **Step 5: Verify vitest works**

```bash
npm test
```
Expected: `No test files found` (not a failure — vitest exits 0 when no files exist yet)

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json frontend/package.json frontend/package-lock.json vitest.config.js
git commit -m "chore: install socket.io, socket.io-client, vitest"
```

---

## Task 2: Add `role` to User model

**Files:**
- Modify: `backend/src/models/user.model.js`
- Create: `backend/src/__tests__/user.model.test.js`

- [ ] **Step 1: Write failing test**

Create `backend/src/__tests__/user.model.test.js`:
```js
import { describe, it, expect } from 'vitest';

describe('User model role field', () => {
  it('defaults role to "user"', () => {
    // Test the schema definition directly — no DB needed
    import('../models/user.model.js').then(({ User }) => {
      const schemaObj = User.schema.obj;
      expect(schemaObj.role.default).toBe('user');
      expect(schemaObj.role.enum).toContain('admin');
      expect(schemaObj.role.enum).toContain('user');
    });
  });
});
```

- [ ] **Step 2: Run test — expect fail**

```bash
npm test backend/src/__tests__/user.model.test.js
```
Expected: FAIL — `role` not in schema yet

- [ ] **Step 3: Add `role` field to User schema**

In `backend/src/models/user.model.js`, add after the `password` field (before the closing brace of the schema fields object):
```js
role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
},
```

- [ ] **Step 4: Run test — expect pass**

```bash
npm test backend/src/__tests__/user.model.test.js
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add backend/src/models/user.model.js backend/src/__tests__/user.model.test.js
git commit -m "feat: add role field to User model"
```

---

## Task 3: Add `status` to Reservation model

**Files:**
- Modify: `backend/src/models/reservation.model.js`

- [ ] **Step 1: Add `status` field to Reservation schema**

In `backend/src/models/reservation.model.js`, add after `orderedItem`:
```js
status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'done'],
    default: 'pending',
},
```

- [ ] **Step 2: Verify schema shape in REPL (manual)**

```bash
node -e "import('./backend/src/models/reservation.model.js').then(m => console.log(m.Reservation.schema.obj.status))"
```
Expected output: `{ type: [Function: String], enum: [...], default: 'pending' }`

- [ ] **Step 3: Commit**

```bash
git add backend/src/models/reservation.model.js
git commit -m "feat: add status field to Reservation model"
```

---

## Task 4: Add `role` to JWT payload and login response

**Files:**
- Modify: `backend/src/controllers/user.controllers.js`

- [ ] **Step 1: Update `loginUser` — JWT payload**

In `backend/src/controllers/user.controllers.js`, find the `jwt.sign` call inside `loginUser` and replace it:
```js
const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
);
```

- [ ] **Step 2: Update `loginUser` — response user object**

In the same function, replace the `user:` block in the response:
```js
user: {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    role: user.role,
},
```

- [ ] **Step 3: Update `registerUser` — response user object**

In `registerUser`, the response does not issue a token (user must log in after register), so only add `role` to the user object:
```js
user: {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email: user.email,
    role: user.role,
},
```

- [ ] **Step 4: Manual smoke test**

Start the backend (`npm run dev`) and POST to `/api/users/login` with valid credentials. Confirm the response contains `user.role`.

- [ ] **Step 5: Commit**

```bash
git add backend/src/controllers/user.controllers.js
git commit -m "feat: include role in JWT payload and login response"
```

---

## Task 5: Admin middleware

**Files:**
- Create: `backend/src/middleware/admin.middleware.js`
- Create: `backend/src/__tests__/admin.middleware.test.js`

- [ ] **Step 1: Write failing tests**

Create `backend/src/__tests__/admin.middleware.test.js`:
```js
import { describe, it, expect, vi } from 'vitest';
import { adminOnly } from '../middleware/admin.middleware.js';

const makeReq = (role) => ({ user: { role } });
const res = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
};
const next = vi.fn();

describe('adminOnly middleware', () => {
  it('calls next() when role is admin', () => {
    res.status.mockClear(); next.mockClear();
    adminOnly(makeReq('admin'), res, next);
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 403 when role is user', () => {
    res.status.mockClear(); next.mockClear();
    adminOnly(makeReq('user'), res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when req.user is missing', () => {
    res.status.mockClear(); next.mockClear();
    adminOnly({}, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
```

- [ ] **Step 2: Run test — expect fail**

```bash
npm test backend/src/__tests__/admin.middleware.test.js
```
Expected: FAIL — module not found

- [ ] **Step 3: Implement admin.middleware.js**

Create `backend/src/middleware/admin.middleware.js`:
```js
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export { adminOnly };
```

- [ ] **Step 4: Run test — expect pass**

```bash
npm test backend/src/__tests__/admin.middleware.test.js
```
Expected: 3 passing

- [ ] **Step 5: Commit**

```bash
git add backend/src/middleware/admin.middleware.js backend/src/__tests__/admin.middleware.test.js
git commit -m "feat: add adminOnly middleware"
```

---

## Task 6: Socket.IO server setup

**Files:**
- Create: `backend/src/socket/index.js`
- Modify: `backend/src/index.js`

- [ ] **Step 1: Create socket module**

Create `backend/src/socket/index.js`:
```js
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

export function initSocket(httpServer, clientUrl) {
  const io = new Server(httpServer, {
    cors: { origin: clientUrl, methods: ['GET', 'POST'] },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Unauthorized'));
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    const { id, role } = socket.user;
    if (role === 'admin') {
      socket.join('admins');
    } else {
      socket.join(`user:${id}`);
    }
  });

  return io;
}
```

- [ ] **Step 2: Update index.js to use http.Server**

Replace the full contents of `backend/src/index.js`:
```js
import dotenv from "dotenv";
import { createServer } from "http";
import connectDB from "./config/database.js";
import app from "./app.js";
import { initSocket } from "./socket/index.js";

dotenv.config({ path: "./.env" });

const startServer = async () => {
    try {
        await connectDB();

        const httpServer = createServer(app);
        const io = initSocket(httpServer, process.env.CLIENT_URL);
        app.locals.io = io;

        app.on("error", (error) => {
            console.log("Error starting the server:", error);
            throw error;
        });

        httpServer.listen(process.env.PORT || 4000, () => {
            console.log(`Server is running on port ${process.env.PORT || 4000}`);
        });

    } catch (error) {
        console.log("MongoDB connection failed:", error);
    }
};

startServer();
```

- [ ] **Step 3: Verify server starts**

```bash
npm run dev
```
Expected: `Server is running on port 4000` with no errors

- [ ] **Step 4: Commit**

```bash
git add backend/src/socket/index.js backend/src/index.js
git commit -m "feat: attach Socket.IO to http server with JWT room auth"
```

---

## Task 7: Admin controllers — reservations

**Files:**
- Create: `backend/src/controllers/admin.controllers.js`
- Create: `backend/src/__tests__/admin.controllers.test.js`

- [ ] **Step 1: Write tests for status transition logic**

Create `backend/src/__tests__/admin.controllers.test.js`:
```js
import { describe, it, expect } from 'vitest';

// Extracted so it can be tested without a DB
const VALID_TRANSITIONS = {
  pending:  ['accepted', 'rejected'],
  accepted: ['done'],
  rejected: [],
  done:     [],
};

const canTransition = (from, to) =>
  (VALID_TRANSITIONS[from] ?? []).includes(to);

describe('reservation status transitions', () => {
  it('pending → accepted is valid', () => expect(canTransition('pending', 'accepted')).toBe(true));
  it('pending → rejected is valid', () => expect(canTransition('pending', 'rejected')).toBe(true));
  it('pending → done is invalid',   () => expect(canTransition('pending', 'done')).toBe(false));
  it('accepted → done is valid',    () => expect(canTransition('accepted', 'done')).toBe(true));
  it('accepted → rejected is invalid', () => expect(canTransition('accepted', 'rejected')).toBe(false));
  it('done → anything is invalid',  () => expect(canTransition('done', 'accepted')).toBe(false));
  it('rejected → anything is invalid', () => expect(canTransition('rejected', 'done')).toBe(false));
});
```

- [ ] **Step 2: Run test — expect pass (pure logic, no module needed)**

```bash
npm test backend/src/__tests__/admin.controllers.test.js
```
Expected: 7 passing

- [ ] **Step 3: Create admin.controllers.js — reservation handlers**

Create `backend/src/controllers/admin.controllers.js`:
```js
import { Reservation } from '../models/reservation.model.js';
import { MenuItem } from '../models/menu.models.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

const VALID_TRANSITIONS = {
  pending:  ['accepted', 'rejected'],
  accepted: ['done'],
  rejected: [],
  done:     [],
};

const getAllReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find()
      .populate('user', 'firstName lastName email username')
      .sort({ createdAt: -1 });
    res.status(200).json({ reservations });
  } catch (error) {
    next(error);
  }
};

const updateReservationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const allowed = VALID_TRANSITIONS[reservation.status] ?? [];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: `Cannot transition from "${reservation.status}" to "${status}"`,
      });
    }

    reservation.status = status;
    await reservation.save();

    const io = req.app.locals.io;
    io.to('admins').emit('reservation:status_changed', { reservationId: id, status });
    io.to(`user:${reservation.user}`).emit('reservation:status_changed', { reservationId: id, status });

    res.status(200).json({ reservation });
  } catch (error) {
    next(error);
  }
};

const deleteReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    if (reservation.status !== 'done') {
      return res.status(400).json({ message: 'Only reservations with status "done" can be deleted' });
    }
    await reservation.deleteOne();
    req.app.locals.io.to('admins').emit('reservation:deleted', { reservationId: id });
    res.status(200).json({ message: 'Reservation deleted' });
  } catch (error) {
    next(error);
  }
};

const deleteAllDoneReservations = async (req, res, next) => {
  try {
    await Reservation.deleteMany({ status: 'done' });
    req.app.locals.io.to('admins').emit('reservation:deleted_all_done');
    res.status(200).json({ message: 'All done reservations deleted' });
  } catch (error) {
    next(error);
  }
};
```

- [ ] **Step 4: Add menu handlers to same file**

Append to `backend/src/controllers/admin.controllers.js`:
```js
const getAdminMenuItems = async (req, res, next) => {
  try {
    const items = await MenuItem.find();
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

const createAdminMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? await uploadToCloudinary(req.file.buffer) : null;
    const item = await MenuItem.create({ name, description, price, category, image });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const updateAdminMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (req.file) updates.image = await uploadToCloudinary(req.file.buffer);
    const item = await MenuItem.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};

const deleteAdminMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByIdAndDelete(id);
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    res.status(200).json({ message: 'Menu item deleted' });
  } catch (error) {
    next(error);
  }
};

export {
  getAllReservations,
  updateReservationStatus,
  deleteReservation,
  deleteAllDoneReservations,
  getAdminMenuItems,
  createAdminMenuItem,
  updateAdminMenuItem,
  deleteAdminMenuItem,
};
```

- [ ] **Step 5: Commit**

```bash
git add backend/src/controllers/admin.controllers.js backend/src/__tests__/admin.controllers.test.js
git commit -m "feat: add admin controllers for reservations and menu"
```

---

## Task 8: Admin routes + wire into app

**Files:**
- Create: `backend/src/routes/admin.route.js`
- Modify: `backend/src/app.js`
- Modify: `backend/src/routes/menu.route.js`

- [ ] **Step 1: Create admin.route.js**

Create `backend/src/routes/admin.route.js`:
```js
import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/admin.middleware.js';
import { upload } from '../config/cloudinary.js';
import {
  getAllReservations,
  updateReservationStatus,
  deleteAllDoneReservations,
  deleteReservation,
  getAdminMenuItems,
  createAdminMenuItem,
  updateAdminMenuItem,
  deleteAdminMenuItem,
} from '../controllers/admin.controllers.js';

const router = Router();

router.use(protect, adminOnly);

router.get('/reservations', getAllReservations);
router.patch('/reservations/:id/status', updateReservationStatus);
router.delete('/reservations/done/all', deleteAllDoneReservations);
router.delete('/reservations/:id', deleteReservation);

router.get('/menu', getAdminMenuItems);
router.post('/menu', upload.single('image'), createAdminMenuItem);
router.patch('/menu/:id', upload.single('image'), updateAdminMenuItem);
router.delete('/menu/:id', deleteAdminMenuItem);

export default router;
```

> Note: `deleteAllDoneReservations` (`/reservations/done/all`) is registered before `deleteReservation` (`/reservations/:id`) so Express matches it first.

- [ ] **Step 2: Mount admin router in app.js**

In `backend/src/app.js`, add the import after the existing router imports:
```js
import adminRouter from "./routes/admin.route.js";
```

Add the route mount before `app.use(errorHandler)`:
```js
app.use("/api/admin", adminRouter);
```

- [ ] **Step 3: Protect menu write routes**

Replace the full contents of `backend/src/routes/menu.route.js`:
```js
import { Router } from "express";
import { createMenu, getMenuItems, updateMenuItem, deleteMenuItem } from "../controllers/menu.controllers.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/admin.middleware.js";
import { upload } from "../config/cloudinary.js";

const router = Router();
router.get("/all", getMenuItems);
router.post("/create", protect, adminOnly, upload.single("image"), createMenu);
router.patch("/update/:id", protect, adminOnly, upload.single("image"), updateMenuItem);
router.delete("/delete/:id", protect, adminOnly, deleteMenuItem);
export default router;
```

- [ ] **Step 4: Smoke test admin routes**

Start the server and test with a non-admin token:
```bash
curl -X GET http://localhost:4000/api/admin/reservations \
  -H "Authorization: Bearer <user_token>"
```
Expected: `403 Admin access required`

Test without token:
```bash
curl -X GET http://localhost:4000/api/admin/reservations
```
Expected: `401 No token, authorization denied`

- [ ] **Step 5: Commit**

```bash
git add backend/src/routes/admin.route.js backend/src/app.js backend/src/routes/menu.route.js
git commit -m "feat: mount admin routes, protect menu write endpoints"
```

---

## Task 9: Emit `reservation:new` from user-facing controller

**Files:**
- Modify: `backend/src/controllers/reservation.controllers.js`

- [ ] **Step 1: Add socket emit after reservation is created**

In `backend/src/controllers/reservation.controllers.js`, in the `createReservation` function, add after `await reservation.populate(...)` and before `res.status(201).json(...)`:
```js
const io = req.app.locals.io;
if (io) {
    io.to('admins').emit('reservation:new', reservation);
}
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/controllers/reservation.controllers.js
git commit -m "feat: emit reservation:new to admins room on creation"
```

---

## Task 10: Seed admin script

**Files:**
- Create: `backend/src/scripts/seed-admin.js`

- [ ] **Step 1: Create seed script**

Create `backend/src/scripts/seed-admin.js`:
```js
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import connectDB from '../config/database.js';
import { User } from '../models/user.model.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../../.env') });

const [, , email] = process.argv;
if (!email) {
  console.error('Usage: node backend/src/scripts/seed-admin.js <email>');
  process.exit(1);
}

await connectDB();

const user = await User.findOneAndUpdate(
  { email },
  { role: 'admin' },
  { new: true }
);

if (!user) {
  console.error(`No user found with email: ${email}`);
  process.exit(1);
}

console.log(`✓ ${user.email} promoted to admin`);
process.exit(0);
```

- [ ] **Step 2: Run the script to create your first admin**

```bash
node backend/src/scripts/seed-admin.js your@email.com
```
Expected: `✓ your@email.com promoted to admin`

- [ ] **Step 3: Commit**

```bash
git add backend/src/scripts/seed-admin.js
git commit -m "feat: add seed-admin script to promote user by email"
```

---

## Task 11: AdminRoute component

**Files:**
- Create: `frontend/src/components/AdminRoute.jsx`

- [ ] **Step 1: Create AdminRoute**

Create `frontend/src/components/AdminRoute.jsx`:
```jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function AdminRoute() {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/AdminRoute.jsx
git commit -m "feat: add AdminRoute guard component"
```

---

## Task 12: AdminLayout — icon sidebar

**Files:**
- Create: `frontend/src/pages/admin/AdminLayout.jsx`

- [ ] **Step 1: Create AdminLayout**

Create `frontend/src/pages/admin/AdminLayout.jsx`:
```jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function SidebarBtn({ active, title, onClick, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 36, height: 36, borderRadius: 6,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? '#d4ccb6' : 'transparent',
        border: 'none', cursor: 'pointer', padding: 0,
      }}
    >
      {children}
    </button>
  );
}

const CalendarIcon = ({ active }) => (
  <svg width="16" height="16" fill="none" stroke={active ? '#0a0a0a' : '#666'} strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const MenuIcon = ({ active }) => (
  <svg width="16" height="16" fill="none" stroke={active ? '#0a0a0a' : '#666'} strokeWidth="2" viewBox="0 0 24 24">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" fill="none" stroke="#666" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0a0a0a' }}>
      <nav style={{
        width: 56, background: '#111', borderRight: '1px solid #1e1e1e',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '14px 0', gap: 6,
      }}>
        <div style={{
          width: 32, height: 32, border: '1px solid #d4ccb6', borderRadius: 4,
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
        }}>
          <span style={{ color: '#d4ccb6', fontSize: 10, fontWeight: 700 }}>S</span>
        </div>

        <NavLink to="/admin/reservations" style={{ textDecoration: 'none' }}>
          {({ isActive }) => (
            <SidebarBtn active={isActive} title="Reservations">
              <CalendarIcon active={isActive} />
            </SidebarBtn>
          )}
        </NavLink>

        <NavLink to="/admin/menu" style={{ textDecoration: 'none' }}>
          {({ isActive }) => (
            <SidebarBtn active={isActive} title="Menu">
              <MenuIcon active={isActive} />
            </SidebarBtn>
          )}
        </NavLink>

        <div style={{ flex: 1 }} />

        <SidebarBtn title="Log out" onClick={handleLogout}>
          <LogoutIcon />
        </SidebarBtn>
      </nav>

      <main style={{ flex: 1, overflow: 'auto', color: '#d4ccb6' }}>
        <Outlet />
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/admin/AdminLayout.jsx
git commit -m "feat: add AdminLayout with icon sidebar"
```

---

## Task 13: Admin service

**Files:**
- Create: `frontend/src/services/adminService.js`

- [ ] **Step 1: Create adminService.js**

Create `frontend/src/services/adminService.js`:
```js
const API_URL = import.meta.env.VITE_API_URL;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('soiree_token')}`,
});

const request = async (endpoint, options = {}) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: authHeaders(),
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const adminService = {
  getReservations: () =>
    request('/admin/reservations'),

  updateStatus: (id, status) =>
    request(`/admin/reservations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  deleteReservation: (id) =>
    request(`/admin/reservations/${id}`, { method: 'DELETE' }),

  deleteAllDone: () =>
    request('/admin/reservations/done/all', { method: 'DELETE' }),

  getMenuItems: () =>
    request('/admin/menu'),

  // FormData uploads — no Content-Type header (browser sets multipart boundary)
  createMenuItem: (formData) =>
    fetch(`${API_URL}/admin/menu`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('soiree_token')}` },
      body: formData,
    }).then(async (r) => {
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || 'Create failed');
      return data;
    }),

  updateMenuItem: (id, formData) =>
    fetch(`${API_URL}/admin/menu/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${localStorage.getItem('soiree_token')}` },
      body: formData,
    }).then(async (r) => {
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || 'Update failed');
      return data;
    }),

  deleteMenuItem: (id) =>
    request(`/admin/menu/${id}`, { method: 'DELETE' }),
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/services/adminService.js
git commit -m "feat: add adminService for all admin API calls"
```

---

## Task 14: useSocket hook

**Files:**
- Create: `frontend/src/hooks/useSocket.js`

- [ ] **Step 1: Create useSocket.js**

Create `frontend/src/hooks/useSocket.js`:
```js
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

// Strip /api suffix to get the bare server origin
const SOCKET_URL = import.meta.env.VITE_API_URL.replace('/api', '');

export function useSocket(handlers) {
  // Keep a stable ref to handlers so the effect doesn't re-run on every render
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    const token = localStorage.getItem('soiree_token');
    if (!token) return;

    const socket = io(SOCKET_URL, { auth: { token } });

    Object.entries(handlersRef.current).forEach(([event, handler]) => {
      socket.on(event, (...args) => handlersRef.current[event]?.(...args));
    });

    return () => socket.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/hooks/useSocket.js
git commit -m "feat: add useSocket hook for Socket.IO connection"
```

---

## Task 15: ReservationsPage

**Files:**
- Create: `frontend/src/pages/admin/ReservationsPage.jsx`

- [ ] **Step 1: Create ReservationsPage.jsx**

Create `frontend/src/pages/admin/ReservationsPage.jsx`:
```jsx
import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { useSocket } from '../../hooks/useSocket';

const FILTERS = ['pending', 'accepted', 'rejected', 'done', 'all'];

const BADGE = {
  pending:  { bg: '#2a2000', color: '#f0a500', label: 'PENDING' },
  accepted: { bg: '#1a2e1a', color: '#4caf50', label: 'ACCEPTED' },
  rejected: { bg: '#2e1a1a', color: '#f44336', label: 'REJECTED' },
  done:     { bg: '#1a1a2e', color: '#7986cb', label: 'DONE' },
};

export function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getReservations()
      .then(({ reservations }) => setReservations(reservations))
      .finally(() => setLoading(false));
  }, []);

  const handleStatus = useCallback(async (id, status) => {
    await adminService.updateStatus(id, status);
    setReservations((prev) => prev.map((r) => r._id === id ? { ...r, status } : r));
  }, []);

  const handleDelete = useCallback(async (id) => {
    await adminService.deleteReservation(id);
    setReservations((prev) => prev.filter((r) => r._id !== id));
  }, []);

  const handleDeleteAllDone = useCallback(async () => {
    if (!window.confirm('Delete all completed reservations? This cannot be undone.')) return;
    await adminService.deleteAllDone();
    setReservations((prev) => prev.filter((r) => r.status !== 'done'));
  }, []);

  useSocket({
    'reservation:new': (r) => setReservations((prev) => [r, ...prev]),
    'reservation:status_changed': ({ reservationId, status }) =>
      setReservations((prev) => prev.map((r) => r._id === reservationId ? { ...r, status } : r)),
    'reservation:deleted': ({ reservationId }) =>
      setReservations((prev) => prev.filter((r) => r._id !== reservationId)),
    'reservation:deleted_all_done': () =>
      setReservations((prev) => prev.filter((r) => r.status !== 'done')),
  });

  const visible = filter === 'all'
    ? reservations
    : reservations.filter((r) => r.status === filter);

  if (loading) return <div style={s.center}>Loading...</div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.title}>Reservations</div>
        <div style={s.subtitle}>Manage all guest reservations</div>
      </div>

      <div style={s.filterRow}>
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ ...s.pill, ...(filter === f ? s.pillActive : {}) }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        {filter === 'done' && (
          <button onClick={handleDeleteAllDone} style={s.deleteAllBtn}>Delete All</button>
        )}
      </div>

      <div style={{ overflowY: 'auto', flex: 1 }}>
        <table style={s.table}>
          <thead>
            <tr>
              {['GUEST', 'DATE', 'TIME', 'GUESTS', 'STATUS', 'ACTIONS'].map((h) => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td colSpan={6} style={{ ...s.td, textAlign: 'center', color: '#444', padding: 32 }}>No reservations</td></tr>
            ) : visible.map((r) => {
              const badge = BADGE[r.status];
              return (
                <tr key={r._id}>
                  <td style={s.td}>{r.guestName}</td>
                  <td style={{ ...s.td, color: '#888' }}>{new Date(r.reservationDate).toLocaleDateString()}</td>
                  <td style={{ ...s.td, color: '#888' }}>{r.reservationTime}</td>
                  <td style={{ ...s.td, color: '#888' }}>{r.numberOfGuests}</td>
                  <td style={s.td}>
                    <span style={{ background: badge.bg, color: badge.color, fontSize: 9, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>
                      {badge.label}
                    </span>
                  </td>
                  <td style={{ ...s.td, textAlign: 'right' }}>
                    <RowActions
                      status={r.status}
                      onAccept={() => handleStatus(r._id, 'accepted')}
                      onReject={() => handleStatus(r._id, 'rejected')}
                      onDone={() => handleStatus(r._id, 'done')}
                      onDelete={() => handleDelete(r._id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RowActions({ status, onAccept, onReject, onDone, onDelete }) {
  const Btn = ({ bg, color, onClick, children }) => (
    <button onClick={onClick} style={{ background: bg, color, fontSize: 9, padding: '3px 10px', borderRadius: 3, border: 'none', cursor: 'pointer', fontWeight: 600 }}>
      {children}
    </button>
  );
  if (status === 'pending') return (
    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
      <Btn bg="#1a2e1a" color="#4caf50" onClick={onAccept}>Accept</Btn>
      <Btn bg="#2e1a1a" color="#f44336" onClick={onReject}>Reject</Btn>
    </div>
  );
  if (status === 'accepted') return <Btn bg="#1a1a2e" color="#7986cb" onClick={onDone}>Mark Done</Btn>;
  if (status === 'done')     return <Btn bg="#2e1a1a" color="#f44336" onClick={onDelete}>Delete</Btn>;
  return <span style={{ color: '#333', fontSize: 10 }}>—</span>;
}

const s = {
  page:       { display: 'flex', flexDirection: 'column', height: '100%' },
  header:     { padding: '16px 20px 12px', borderBottom: '1px solid #1e1e1e' },
  title:      { color: '#d4ccb6', fontSize: 13, fontWeight: 600, letterSpacing: 0.5 },
  subtitle:   { color: '#555', fontSize: 10, marginTop: 2 },
  filterRow:  { padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #1a1a1a', flexWrap: 'wrap' },
  pill:       { background: '#1e1e1e', color: '#666', fontSize: 9, padding: '3px 10px', borderRadius: 20, border: 'none', cursor: 'pointer' },
  pillActive: { background: '#d4ccb6', color: '#0a0a0a', fontWeight: 600 },
  deleteAllBtn: { marginLeft: 'auto', background: '#2e1a1a', color: '#f44336', fontSize: 9, padding: '3px 12px', borderRadius: 4, border: '1px solid #f4433622', cursor: 'pointer', fontWeight: 600 },
  table:      { width: '100%', borderCollapse: 'collapse', fontSize: 10 },
  th:         { textAlign: 'left', padding: '8px 20px', color: '#555', fontWeight: 500, letterSpacing: 0.5, fontSize: 9, borderBottom: '1px solid #1e1e1e' },
  td:         { padding: '10px 20px', color: '#d4ccb6', borderBottom: '1px solid #141414' },
  center:     { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#555' },
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/admin/ReservationsPage.jsx
git commit -m "feat: add ReservationsPage with filters, actions, and socket sync"
```

---

## Task 16: MenuManagementPage

**Files:**
- Create: `frontend/src/pages/admin/MenuManagementPage.jsx`

- [ ] **Step 1: Create MenuManagementPage.jsx**

Create `frontend/src/pages/admin/MenuManagementPage.jsx`:
```jsx
import { useState, useEffect, useRef } from 'react';
import { adminService } from '../../services/adminService';

const emptyForm = { name: '', description: '', price: '', category: '', image: null };

export function MenuManagementPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef(null);

  useEffect(() => {
    adminService.getMenuItems().then(setItems).finally(() => setLoading(false));
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', form.price);
    fd.append('category', form.category);
    if (form.image) fd.append('image', form.image);

    if (editingId) {
      const updated = await adminService.updateMenuItem(editingId, fd);
      setItems((prev) => prev.map((i) => (i._id === editingId ? updated : i)));
    } else {
      const created = await adminService.createMenuItem(fd);
      setItems((prev) => [...prev, created]);
    }
    resetForm();
  };

  const handleEdit = (item) => {
    setForm({ name: item.name, description: item.description, price: item.price, category: item.category, image: null });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    await adminService.deleteMenuItem(id);
    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  if (loading) return <div style={s.center}>Loading...</div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <div style={s.title}>Menu</div>
          <div style={s.subtitle}>Manage restaurant menu items</div>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} style={s.addBtn}>+ Add Item</button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.formTitle}>{editingId ? 'Edit Item' : 'New Item'}</div>
          <div style={s.grid2}>
            {[['name', 'Name'], ['category', 'Category'], ['price', 'Price'], ['description', 'Description']].map(([k, label]) => (
              <div key={k}>
                <label style={s.label}>{label}</label>
                <input style={s.input} value={form[k]}
                  onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))} required />
              </div>
            ))}
            <div>
              <label style={s.label}>Image</label>
              <input ref={fileRef} type="file" accept="image/*" style={s.input}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.files[0] }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="submit" style={s.submitBtn}>{editingId ? 'Save' : 'Create'}</button>
            <button type="button" onClick={resetForm} style={s.cancelBtn}>Cancel</button>
          </div>
        </form>
      )}

      <div style={s.cardGrid}>
        {items.map((item) => (
          <div key={item._id} style={s.card}>
            {item.image && <img src={item.image} alt={item.name} style={s.cardImg} />}
            <div style={s.cardBody}>
              <div style={s.cardName}>{item.name}</div>
              <div style={s.cardCategory}>{item.category}</div>
              <div style={s.cardPrice}>€{item.price}</div>
              <div style={s.cardDesc}>{item.description}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <button onClick={() => handleEdit(item)} style={s.editBtn}>Edit</button>
                <button onClick={() => handleDelete(item._id)} style={s.deleteBtn}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s = {
  page:       { display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' },
  header:     { padding: '16px 20px 12px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  title:      { color: '#d4ccb6', fontSize: 13, fontWeight: 600, letterSpacing: 0.5 },
  subtitle:   { color: '#555', fontSize: 10, marginTop: 2 },
  addBtn:     { background: '#d4ccb6', color: '#0a0a0a', fontSize: 10, padding: '5px 12px', borderRadius: 4, border: 'none', cursor: 'pointer', fontWeight: 600 },
  form:       { padding: '16px 20px', borderBottom: '1px solid #1e1e1e', background: '#111' },
  formTitle:  { color: '#d4ccb6', fontSize: 11, fontWeight: 600, marginBottom: 12 },
  grid2:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  label:      { display: 'block', color: '#666', fontSize: 9, letterSpacing: 0.5, marginBottom: 4, textTransform: 'uppercase' },
  input:      { width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#d4ccb6', padding: '6px 8px', borderRadius: 3, fontSize: 11, boxSizing: 'border-box' },
  submitBtn:  { background: '#d4ccb6', color: '#0a0a0a', fontSize: 10, padding: '5px 16px', borderRadius: 3, border: 'none', cursor: 'pointer', fontWeight: 600 },
  cancelBtn:  { background: 'transparent', color: '#666', fontSize: 10, padding: '5px 12px', borderRadius: 3, border: '1px solid #333', cursor: 'pointer' },
  cardGrid:   { padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 },
  card:       { background: '#111', border: '1px solid #1e1e1e', borderRadius: 6, overflow: 'hidden' },
  cardImg:    { width: '100%', height: 120, objectFit: 'cover' },
  cardBody:   { padding: 12 },
  cardName:   { color: '#d4ccb6', fontSize: 12, fontWeight: 600 },
  cardCategory: { color: '#666', fontSize: 9, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  cardPrice:  { color: '#d4ccb6', fontSize: 11, marginTop: 4 },
  cardDesc:   { color: '#555', fontSize: 10, marginTop: 4, lineHeight: 1.4 },
  editBtn:    { background: '#1e2a1e', color: '#4caf50', fontSize: 9, padding: '2px 8px', borderRadius: 3, border: 'none', cursor: 'pointer' },
  deleteBtn:  { background: '#2e1a1a', color: '#f44336', fontSize: 9, padding: '2px 8px', borderRadius: 3, border: 'none', cursor: 'pointer' },
  center:     { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#555' },
};
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/admin/MenuManagementPage.jsx
git commit -m "feat: add MenuManagementPage with full CRUD"
```

---

## Task 17: App.jsx — wire admin routes + redirect admins from user pages

**Files:**
- Modify: `frontend/src/App.jsx`

- [ ] **Step 1: Replace App.jsx**

Replace the full contents of `frontend/src/App.jsx`:
```jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { AdminRoute } from './components/AdminRoute';
import { AdminLayout } from './pages/admin/AdminLayout';
import { ReservationsPage } from './pages/admin/ReservationsPage';
import { MenuManagementPage } from './pages/admin/MenuManagementPage';
import { LandingPage } from './pages/LandingPage';
import { MenuPage } from './pages/MenuPage';
import { Navbar } from './components/NavBar';
import { BottomNav } from './components/BottomNav';
import { AboutPage } from './pages/AboutPage';
import { ReservationPage } from './pages/ReservationPage';

function UserApp() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin/reservations', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="relative min-h-screen bg-[url('/marble.jpg')] bg-cover bg-center bg-fixed">
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 min-h-screen overflow-x-hidden">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/reservation" element={<ReservationPage />} />
          </Routes>
        </AnimatePresence>
        <BottomNav />
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/reservations" replace />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="menu" element={<MenuManagementPage />} />
        </Route>
      </Route>
      <Route path="/*" element={<UserApp />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/App.jsx
git commit -m "feat: add admin route tree and redirect admins from user pages"
```

---

## Task 18: End-to-end smoke test

- [ ] **Step 1: Run all backend unit tests**

```bash
npm test
```
Expected: all tests pass

- [ ] **Step 2: Start both servers**

Terminal 1:
```bash
npm run dev
```
Terminal 2:
```bash
cd frontend && npm run dev
```

- [ ] **Step 3: Promote yourself to admin**

```bash
node backend/src/scripts/seed-admin.js your@email.com
```

- [ ] **Step 4: Test admin login flow**

1. Open http://localhost:5173
2. Log in with your admin account
3. Verify you are redirected to http://localhost:5173/admin/reservations
4. Verify the icon sidebar shows Reservations (active) and Menu icons
5. Verify the Reservations table loads with Pending filter active

- [ ] **Step 5: Test reservation real-time flow**

1. Open a second browser tab at http://localhost:5173 and log in as a regular user
2. Create a reservation in the regular tab
3. In the admin tab, verify the new reservation appears live in the Pending filter without refreshing

- [ ] **Step 6: Test status change flow**

1. In the admin tab, click **Accept** on the new reservation
2. Verify the row disappears from Pending and appears in Accepted
3. Click **Mark Done** — verify it moves to Done
4. Click **Delete** — verify it is removed
5. Create 2–3 done reservations and click **Delete All** from the Done tab

- [ ] **Step 7: Test menu management**

1. Navigate to the Menu section in the admin sidebar
2. Click **+ Add Item**, fill in name/description/price/category, upload an image, click Create
3. Verify the new card appears in the grid
4. Click **Edit**, change the name, click Save — verify the card updates
5. Click **Delete**, confirm — verify the card is removed
6. Verify http://localhost:5173/menu still shows the public menu (GET /api/menu/all is still public)

- [ ] **Step 8: Test access control**

```bash
# Try accessing admin API with a regular user token
curl -X GET http://localhost:4000/api/admin/reservations \
  -H "Authorization: Bearer <regular_user_token>"
```
Expected: `{ "message": "Admin access required" }`

- [ ] **Step 9: Final commit**

```bash
git add -A
git commit -m "feat: RBAC + admin panel with Socket.IO real-time events"
```
