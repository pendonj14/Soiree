import dotenv from "dotenv";
import connectDB from "./config/database.js";
import app from "./app.js";

dotenv.config({
    path: "./.env"
});

const startServer = async () => {
    try {
        await connectDB();

        app.on("error", (error) => {
            console.log("Error starting the server:", error);
            throw error; // Rethrow the error to be caught by the outer catch block
        });

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port 
                ${process.env.PORT || 8000}`);
        });

    } catch (error) {
        console.log("MongoDB connection failed:", error);
    }
}

startServer();