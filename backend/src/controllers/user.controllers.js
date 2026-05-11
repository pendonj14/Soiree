import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis.js";

const registerUser = async (req, res, next) => {
    try {
        const { firstName, lastName, username, email, password } = req.body;

        if (!firstName || !lastName || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(409).json({ message: "An account with this email already exists" });
        }

        const existingUsername = await User.findOne({ username: username.toLowerCase() });
        if (existingUsername) {
            return res.status(409).json({ message: "Username is already taken" });
        }

        const user = await User.create({ firstName, lastName, username, email, password });

        res.status(201).json({
            message: "Account created successfully",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        next(error);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        next(error);
    }
};

const logoutUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(400).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
            return res.status(401).json({ message: "Token is invalid or expired" });
        }

        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
            try {
                await redisClient.set(`blocklist:${token}`, "1", { EX: ttl });
            } catch (cacheErr) {
                console.warn("Redis blocklist write failed:", cacheErr.message);
            }
        }

        res.status(200).json({ message: "Logout successful" });

    } catch (error) {
        next(error);
    }
};

export { registerUser, loginUser, logoutUser };
