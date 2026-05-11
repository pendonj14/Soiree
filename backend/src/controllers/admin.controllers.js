import { Reservation } from '../models/reservation.model.js';
import { MenuItem } from '../models/menu.models.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { redisClient } from "../config/redis.js";

const MENU_CACHE_KEY = "menu:all";
const MENU_CACHE_TTL = 600; // 10 minutes in seconds

const VALID_TRANSITIONS = {
  pending: ['accepted', 'rejected'],
  accepted: ['done'],
  rejected: [],
  done: [],
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
    if (io) {
      io.to('admins').emit('reservation:status_changed', { reservationId: id, status });
      io.to(`user:${reservation.user}`).emit('reservation:status_changed', { reservationId: id, status });
    }

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
    const io = req.app.locals.io;
    if (io) io.to('admins').emit('reservation:deleted', { reservationId: id });
    res.status(200).json({ message: 'Reservation deleted' });
  } catch (error) {
    next(error);
  }
};

const deleteAllDoneReservations = async (req, res, next) => {
  try {
    await Reservation.deleteMany({ status: 'done' });
    const io = req.app.locals.io;
    if (io) io.to('admins').emit('reservation:deleted_all_done');
    res.status(200).json({ message: 'All done reservations deleted' });
  } catch (error) {
    next(error);
  }
};

const getAdminMenuItems = async (req, res, next) => {
  try {
    // Try cache first, but don't crash if Redis is down
    try {
      const cachedData = await redisClient.get(MENU_CACHE_KEY);
      if (cachedData) {
        console.log("📦 Cache HIT — serving menu from Redis");
        return res.status(200).json(JSON.parse(cachedData));
      }
    } catch (cacheErr) {
      console.warn("Redis read failed, falling back to DB:", cacheErr.message);
    }

    // Cache MISS or Redis down — query MongoDB
    console.log("🔍 Cache MISS — querying MongoDB");
    const items = await MenuItem.find();

    // Try to cache the result, but don't crash if it fails
    try {
      await redisClient.set(
        MENU_CACHE_KEY,
        JSON.stringify(items),
        { EX: MENU_CACHE_TTL }
      );
    } catch (cacheErr) {
      console.warn("Redis write failed:", cacheErr.message);
    }

    return res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

const createAdminMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? await uploadToCloudinary(req.file.buffer) : null;
    const item = await MenuItem.create({ name, description, price, category, image });

    try { await redisClient.del(MENU_CACHE_KEY); } catch (cacheErr) {
      console.warn("Redis invalidation failed:", cacheErr.message);
    }

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

    try { await redisClient.del(MENU_CACHE_KEY); } catch (cacheErr) {
      console.warn("Redis invalidation failed:", cacheErr.message);
    }

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

    try { await redisClient.del(MENU_CACHE_KEY); } catch (cacheErr) {
      console.warn("Redis invalidation failed:", cacheErr.message);
    }

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
