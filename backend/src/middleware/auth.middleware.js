import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis.js";

const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        try {
            const isBlocked = await redisClient.get(`blocklist:${token}`);
            if (isBlocked) {
                return res.status(401).json({ message: "Token is invalid or expired" });
            }
        } catch (cacheErr) {
            console.warn("Redis blocklist check failed:", cacheErr.message);
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token is invalid or expired" });
    }
};

export { protect };