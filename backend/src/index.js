import dotenv from "dotenv";
import { createServer } from "http";
import connectDB from "./config/database.js";
import app from "./app.js";
import { initSocket } from "./socket/index.js";
import { connectRedis } from "./config/redis.js";

dotenv.config({ path: "./.env" });

const startServer = async () => {
    try {
        await connectDB();
        await connectRedis();

        const httpServer = createServer(app);
        const io = initSocket(httpServer, process.env.CLIENT_URL);
        app.locals.io = io;

        app.on("error", (error) => {
            console.log("Error starting the server:", error);
            throw error;
        });

        httpServer.listen(process.env.PORT || 4000, () => {
            console.log(`Server is running on port ${process.env.PORT || 4000}`);
        });

    } catch (error) {
        console.log("MongoDB connection failed:", error);
    }
};

startServer();
