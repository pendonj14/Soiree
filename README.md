# SOIRÉE — Restaurant Reservation System

A full-stack restaurant reservation web app with a React frontend and a Node.js/Express REST API backend backed by MongoDB.

---

## Project Structure

```
SORIER/
├── backend/
│   └── src/
│       ├── config/         # DB connection & constants
│       ├── controllers/    # Route handlers (users, reservations)
│       ├── middleware/     # Auth (JWT) & error handling
│       ├── models/         # Mongoose schemas
│       ├── routes/         # Express routers
│       ├── app.js          # Express app setup
│       └── index.js        # Server entry point
├── frontend/
│   └── src/
│       ├── components/     # NavBar, SideCard
│       ├── pages/          # LandingPage
│       ├── App.jsx
│       └── main.jsx
├── .env
└── package.json
```

---

## Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS 4                  |
| Backend   | Node.js, Express 5                              |
| Database  | MongoDB via Mongoose                            |
| Auth      | JWT (jsonwebtoken) + bcrypt                     |
| Security  | Helmet, CORS, express-rate-limit                |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- A running MongoDB instance (local or Atlas)

### Environment Variables

Create a `.env` file at the project root:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

### Install & Run

**Backend**

```bash
# From project root
npm install
npm run dev       # development (nodemon)
npm start         # production
```

**Frontend**

```bash
cd frontend
npm install
npm run dev       # Vite dev server at http://localhost:5173
npm run build     # Production build
```

---

## API Reference

### Users — `/api/users`

| Method | Endpoint    | Auth | Description       |
|--------|-------------|------|-------------------|
| POST   | `/register` | No   | Register new user |
| POST   | `/login`    | No   | Login & get token |
| POST   | `/logout`   | No   | Logout user       |

### Reservations — `/api/reservations`

All reservation routes require a valid JWT (`Authorization: Bearer <token>`).

| Method | Endpoint        | Description               |
|--------|-----------------|---------------------------|
| POST   | `/create`       | Create a reservation      |
| GET    | `/all`          | Get all user reservations |
| PATCH  | `/update/:id`   | Update a reservation      |
| DELETE | `/delete/:id`   | Delete a reservation      |

### Reservation Schema

```json
{
  "user": "ObjectId (ref: User)",
  "reservationDate": "Date",
  "reservationTime": "String",
  "numberOfGuests": "Number",
  "orderedItem": "String"
}
```

---

## Security

- **Helmet** — sets secure HTTP headers
- **CORS** — restricted to `CLIENT_URL`
- **Rate limiting** — 100 requests per IP per 15 minutes
- **JWT** — protects all reservation endpoints
- **bcrypt** — password hashing

---

## License

ISC — see [package.json](package.json)
