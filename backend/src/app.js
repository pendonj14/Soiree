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
        origin: (_origin, callback) => callback(null, process.env.CLIENT_URL),
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }));
    app.use(limiter);
    app.use(express.json());
    app.use("/api/users", userRouter);
    app.use("/api/reservations", reservationRouter);
    app.use("/api/menu", menuRouter);
    app.use("/api/admin", adminRouter);
    app.use(errorHandler);
export default app;