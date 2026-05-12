import express from "express";
import userRouter from "./routes/user.route.js";
import reservationRouter from "./routes/reservation.route.js";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import errorHandler from "./middleware/error.middleware.js";
import menuRouter from "./routes/menu.route.js";
import adminRouter from "./routes/admin.route.js";

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                  // max 100 requests per IP per window
    message: { message: "Too many requests, please try again later." },
});

const app = express();
app.use(helmet());
app.use(cors({
    origin: function (origin, callback) {
        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        // Remove trailing slash for exact matching
        const normalizedClientUrl = clientUrl.replace(/\/$/, "");
        
        const allowedOrigins = [
            normalizedClientUrl,
            "http://localhost:5173",
            "http://localhost:4173"
        ];

        // Allow if no origin (e.g. Postman), matches allowed origins, or is a Vercel preview/deployment
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.log("CORS blocked origin:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(limiter);
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/reservations", reservationRouter);
app.use("/api/menu", menuRouter);
app.use("/api/admin", adminRouter);
app.use(errorHandler);
export default app;