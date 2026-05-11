import { Reservation } from "../models/reservation.model.js";
import { User } from "../models/user.model.js";
import { redisClient } from "../config/redis.js";

const USER_CACHE_KEY = (id) => `user:${id}`;
const USER_CACHE_TTL = 300; // 5 minutes

const createReservation = async (req, res, next) => {
    try {
        const { reservationDate, reservationTime, numberOfGuests, orderedItem } = req.body;

        if (!reservationDate) {
            return res.status(400).json({ message: "Reservation date is required" });
        }
        if (!reservationTime) {
            return res.status(400).json({ message: "Reservation time is required" });
        }
        if (!numberOfGuests || numberOfGuests < 1) {
            return res.status(400).json({ message: "Number of guests must be at least 1" });
        }

        const parsedDate = new Date(reservationDate);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: "Invalid reservation date" });
        }
        if (parsedDate < new Date().setHours(0, 0, 0, 0)) {
            return res.status(400).json({ message: "Reservation date cannot be in the past" });
        }

        // Fetch user to auto-populate guest name — cache to avoid DB hit on every reservation
        let user;
        try {
            const cachedUser = await redisClient.get(USER_CACHE_KEY(req.user.id));
            if (cachedUser) user = JSON.parse(cachedUser);
        } catch (cacheErr) {
            console.warn("Redis read failed, falling back to DB:", cacheErr.message);
        }

        if (!user) {
            user = await User.findById(req.user.id).select("firstName lastName");
            if (!user) {
                return res.status(404).json({ message: "User account not found" });
            }
            try {
                await redisClient.set(USER_CACHE_KEY(req.user.id), JSON.stringify(user), { EX: USER_CACHE_TTL });
            } catch (cacheErr) {
                console.warn("Redis write failed:", cacheErr.message);
            }
        }

        const guestName = `${user.firstName} ${user.lastName}`;

        const reservation = await Reservation.create({
            user: req.user.id,
            guestName,
            reservationDate: parsedDate,
            reservationTime,
            numberOfGuests: Number(numberOfGuests),
            orderedItem: orderedItem || "",
        });

        await reservation.populate("user", "firstName lastName email username");

        const io = req.app.locals.io;
        if (io) {
            io.to('admins').emit('reservation:new', reservation);
        }

        res.status(201).json({
            message: "Reservation created successfully",
            reservation,
        });

    } catch (error) {
        next(error);
    }
};

const getReservations = async (_req, res, next) => {
    try {
        const reservations = await Reservation.find()
            .populate("user", "firstName lastName email username")
            .sort({ reservationDate: 1 });

        res.status(200).json({
            message: "Reservations retrieved successfully",
            reservations,
        });
    } catch (error) {
        next(error);
    }
};

const updateReservation = async (req, res, next) => {
    try {
        const { id } = req.params;

        const updatedReservation = await Reservation.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).populate("user", "firstName lastName email username");

        if (!updatedReservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.status(200).json({
            message: "Reservation updated successfully",
            reservation: updatedReservation,
        });

    } catch (error) {
        next(error);
    }
};

const deleteReservation = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedReservation = await Reservation.findByIdAndDelete(id);
        if (!deletedReservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        res.status(200).json({
            message: "Reservation deleted successfully",
            reservation: deletedReservation,
        });
    } catch (error) {
        next(error);
    }
};

export { createReservation, getReservations, updateReservation, deleteReservation };
