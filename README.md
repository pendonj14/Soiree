# SOIRÉE — Restaurant Reservation System

A full-stack restaurant reservation web app with a React frontend and a Node.js/Express REST API backend backed by MongoDB. Features JWT authentication, user profiles, and a complete reservation booking flow.

---

## Project Structure

```
SOIRER/
├── backend/
│   └── src/
│       ├── config/              # DB connection & constants
│       ├── controllers/         # Route handlers (users, reservations, menu)
│       │   ├── user.controllers.js
│       │   ├── reservation.controllers.js
│       │   └── menu.controllers.js
│       ├── middleware/          # Auth (JWT) & error handling
│       │   ├── auth.middleware.js (protect your routes with JWT)
│       │   └── error.middleware.js
│       ├── models/              # Mongoose schemas
│       │   ├── user.model.js (firstName, lastName, email, username, password)
│       │   ├── reservation.model.js (guestName auto-populated)
│       │   └── menu.models.js
│       ├── routes/              # Express routers
│       │   ├── user.route.js
│       │   ├── reservation.route.js (protected)
│       │   └── menu.route.js
│       ├── app.js               # Express app setup
│       └── index.js             # Server entry point
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── NavBar.jsx (profile dropdown, Book a Table)
│       │   ├── AuthModal.jsx (login/register with firstName/lastName)
│       │   ├── MenuItem.jsx
│       │   ├── MenuSectionTitle.jsx
│       │   ├── SideCard.jsx
│       │   └── Carousel.jsx
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── MenuPage.jsx
│       │   ├── AboutPage.jsx
│       │   └── ReservationPage.jsx (connected to backend)
│       ├── context/
│       │   └── AuthContext.jsx (useAuth hook, JWT in localStorage)
│       ├── hooks/
│       │   ├── useMenu.js
│       │   └── useAuth.js (exported from AuthContext)
│       ├── services/
│       │   ├── authService.js (login, register, logout)
│       │   ├── reservationService.js (CRUD with Bearer token)
│       │   └── menuService.js
│       ├── App.jsx (wrapped with AuthProvider)
│       └── main.jsx
├── .env (backend)
├── frontend/.env
└── package.json
```

---

## Tech Stack

| Layer       | Technology                                        |
|-------------|----------------------------------------------------|
| Frontend    | React 19, Vite 8, Tailwind CSS 4, React Router 7  |
| Backend     | Node.js, Express 5                                 |
| Database    | MongoDB (Atlas) via Mongoose                       |
| Auth        | JWT (jsonwebtoken) + bcrypt (password hashing)     |
| Image Upload| Cloudinary + Multer                                |
| Security    | Helmet, CORS, express-rate-limit                   |

---

## Features

### Authentication
- **Register** — Create account with first name, last name, username, email, password
- **Login** — JWT token generation & storage in localStorage
- **Modal Flow** — unauthenticated users see login modal when clicking "Book a Table"
- **Profile Dropdown** — click user icon in navbar to see profile menu with sign out

### Reservations
- **Auto-populated Fields** — guest name automatically pulled from user profile
- **Form Validation** — date validation (no past dates), time & guest count validation
- **Protected Routes** — all reservation endpoints require `Authorization: Bearer <token>`
- **Error Handling** — proper error messages for all failures

### Restaurant Menu
- **Category Display** — all menu items shown by category with scrollable pills
- **Image Upload** — via Cloudinary

---

## Getting Started

### Option 1 — Docker (recommended for teams)

The fastest way to run the full stack on any machine. Requires only [Docker Desktop](https://www.docker.com/products/docker-desktop/).

#### MongoDB Atlas — one-time IP whitelist setup

Instead of adding each teammate's IP manually, allow all IPs for development:

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com) → **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (`0.0.0.0/0`) → **Confirm**

> Restrict this to specific IPs before going to production.

#### Configure environment variables

Copy both example files and fill in your credentials:

```bash
# From project root
cp .env.example .env
cp frontend/.env.example frontend/.env
```

**Backend** (`.env` at project root):
```env
PORT=4000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/soiree?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:4000/api
```

> Never commit `.env` files — they are in `.gitignore`.

#### Start

```bash
docker compose up
```

Both servers start with hot reload:
- **Frontend** → http://localhost:5173
- **Backend API** → http://localhost:4000/api

#### Stop

```bash
docker compose down
```

#### Rebuild

Run this after adding/removing npm packages or after pulling changes that modified `package.json` or the Dockerfiles:

```bash
docker compose down -v        # removes named volumes (node_modules inside containers)
docker compose up --build     # rebuilds images and starts fresh
```

If you only changed a Dockerfile (not `package.json`), you can skip `-v`:

```bash
docker compose up --build
```

---

### Option 2 — Manual setup

#### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- npm

#### Environment Variables

Same `.env` contents as shown above under the Docker section.

#### Install & Run

**Backend**
```bash
# From project root
npm install
npm run dev       # development with nodemon
npm start         # production
```

**Frontend**
```bash
cd frontend
npm install
npm run dev       # Vite dev server at http://localhost:5173
npm run build     # Production build
npm run preview   # Preview production build
```

---

## API Reference

### Users — `/api/users`

| Method | Endpoint  | Auth | Body                                              |
|--------|-----------|------|---------------------------------------------------|
| POST   | `/register` | No | `firstName`, `lastName`, `username`, `email`, `password` |
| POST   | `/login`    | No | `email`, `password` → returns `token` + `user` |
| POST   | `/logout`   | No | `email`                                           |

**Response (Login/Register)**
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "firstName": "Jane",
    "lastName": "Smith",
    "username": "janesmith",
    "email": "jane@example.com"
  }
}
```

### Reservations — `/api/reservations`

**All routes require:** `Authorization: Bearer <token>` header.

| Method | Endpoint        | Description                    |
|--------|-----------------|--------------------------------|
| POST   | `/create`       | Create a reservation           |
| GET    | `/all`          | Fetch all reservations         |
| PATCH  | `/update/:id`   | Update a reservation           |
| DELETE | `/delete/:id`   | Delete a reservation           |

**POST `/create` Body**
```json
{
  "reservationDate": "2026-05-15",
  "reservationTime": "19:30",
  "numberOfGuests": 4,
  "orderedItem": "Vegetarian preferences"  // optional
}
```

**Response**
```json
{
  "message": "Reservation created successfully",
  "reservation": {
    "_id": "...",
    "guestName": "Jane Smith",  // auto-populated
    "reservationDate": "2026-05-15T00:00:00.000Z",
    "reservationTime": "19:30",
    "numberOfGuests": 4,
    "orderedItem": "Vegetarian preferences",
    "user": {
      "_id": "...",
      "firstName": "Jane",
      "lastName": "Smith",
      "username": "janesmith",
      "email": "jane@example.com"
    },
    "createdAt": "2026-04-13T...",
    "updatedAt": "2026-04-13T..."
  }
}
```

**Field Validation**
- `reservationDate` — required, must not be in the past
- `reservationTime` — required (24-hour format, e.g., "19:30")
- `numberOfGuests` — required, minimum 1
- `orderedItem` — optional, defaults to empty string

### Menu — `/api/menu`

| Method | Endpoint | Auth | Description        |
|--------|----------|------|---------------------|
| POST   | `/create` | No  | Create menu item   |
| GET    | `/all`    | No  | Get all menu items |
| PATCH  | `/update/:id` | No | Update menu item |
| DELETE | `/delete/:id` | No | Delete menu item |

---

## Frontend Auth Flow

1. User clicks "Book a Table" button
2. If not authenticated → **AuthModal** pops up (Login/Register tabs)
3. User registers (first name, last name, username, email, password) or logs in
4. JWT token stored in localStorage + AuthContext
5. User automatically redirected to reservation page
6. Reservation form auto-fills guest name from logged-in user
7. Form submission includes `Authorization: Bearer <token>` header
8. Profile icon in navbar shows dropdown with username and "Sign Out"

---

## Security

- **JWT Authentication** — all reservation endpoints protected
- **bcrypt** — passwords hashed with 10 salt rounds
- **Helmet** — sets secure HTTP headers
- **CORS** — restricted to `CLIENT_URL`
- **Rate Limiting** — 100 requests per IP per 15 minutes
- **Input Validation** — date validation (no past dates), required field checks
- **Error Messages** — specific, informative error messages without exposing internals

---

## Error Handling

Backend returns structured error responses:
```json
{
  "message": "User account not found"
}
```

Status codes:
- `201` — Resource created
- `200` — Success
- `400` — Bad request (validation failed)
- `401` — Unauthorized (invalid token)
- `404` — Resource not found
- `409` — Conflict (email/username already exists)
- `500` — Server error

---

## Development Notes

### Token Management
- JWT stored in `localStorage` under keys `soiree_token` and `soiree_user`
- Token sent in all API requests as `Authorization: Bearer <token>`
- Token expiration handled by backend (7 days by default)
- On logout, token + user data cleared from localStorage

### Database Indexes
- `User.email` — unique
- `User.username` — unique
- `Reservation.user` — ref to User

### Scalability
- Cloudinary integration for image uploads (no local disk storage)
- MongoDB connection pooling via Mongoose
- JWT stateless auth (no session storage needed)
- Rate limiting prevents abuse

---

## License

ISC — see [package.json](package.json)
