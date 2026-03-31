import express from "express";
import userRouter from "./routes/user.route.js";
import reservationRouter from "./routes/reservation.route.js";

const app = express();
    app.use(express.json());
    app.use("/api/users", userRouter);
    app.use("/api/reservations", reservationRouter);
export default app;