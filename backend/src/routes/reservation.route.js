import { Router } from "express";
import { createReservation, getReservations, updateReservation, deleteReservation } from "../controllers/reservation.controllers.js";

const router = Router();
    router.post("/create", createReservation);
    router.get("/all", getReservations);
    router.patch("/update/:id", updateReservation);
    router.delete("/delete/:id", deleteReservation);
export default router;