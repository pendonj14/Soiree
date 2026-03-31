import { Router } from "express";
import { createReservation } from "../controllers/reservation.controllers.js";

const router = Router();
    router.post("/create", createReservation);
export default router;