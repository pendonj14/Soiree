import { MenuItem } from "../models/menu.models.js";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { redisClient } from "../config/redis.js";

const MENU_CACHE_KEY = "menu:all";
const MENU_CACHE_TTL = 600; // 10 minutes in seconds

const createMenu = async (req, res, next) => {
    try {
        const { name, description, price, category } = req.body;
        const image = req.file ? await uploadToCloudinary(req.file.buffer) : null;
        const menuItem = new MenuItem({ name, description, price, category, image });
        await menuItem.save();

        try { await redisClient.del(MENU_CACHE_KEY); } catch (cacheErr) {
            console.warn("Redis invalidation failed:", cacheErr.message);
        }

        res.status(201).json(menuItem);
    } catch (error) {
        next(error);
    }
}

const getMenuItems = async (req, res, next) => {
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
        const menuItems = await MenuItem.find();

        // Try to cache the result, but don't crash if it fails
        try {
            await redisClient.set(
                MENU_CACHE_KEY,
                JSON.stringify(menuItems),
                { EX: MENU_CACHE_TTL }
            );
        } catch (cacheErr) {
            console.warn("Redis write failed:", cacheErr.message);
        }

        res.status(200).json(menuItems);
    } catch (error) {
        next(error);
    }
}

const updateMenuItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };
        if (req.file) updates.image = await uploadToCloudinary(req.file.buffer);
        const updatedMenuItem = await MenuItem.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedMenuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        try { await redisClient.del(MENU_CACHE_KEY); } catch (cacheErr) {
            console.warn("Redis invalidation failed:", cacheErr.message);
        }

        res.status(200).json(updatedMenuItem);
    } catch (error) {
        next(error);
    }
}

const deleteMenuItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletedMenuItem = await MenuItem.findByIdAndDelete(id);
        if (!deletedMenuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }

        try { await redisClient.del(MENU_CACHE_KEY); } catch (cacheErr) {
            console.warn("Redis invalidation failed:", cacheErr.message);
        }

        res.status(200).json({ message: "Menu item deleted successfully" });
    } catch (error) {
        next(error);
    }
}

export { createMenu, getMenuItems, updateMenuItem, deleteMenuItem };

