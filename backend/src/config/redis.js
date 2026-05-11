import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});

// Log connection events
redisClient.on("connect", () => console.log("Redis connected"));
redisClient.on("error", (err) => console.error("Redis error:", err));

// Connect to Redis (call this once at startup)
const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Redis ready");
    } catch (error) {
        console.error("Failed to connect to Redis:", error);
        // Don't crash the app — the app can still work without cache
    }
};

export { redisClient, connectRedis };
