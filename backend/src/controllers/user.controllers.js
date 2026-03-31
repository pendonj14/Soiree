import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        
        //basic validation
        if (!username || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        //check if user already exists
        const existingUser = await User.findOne({email:email});
        if (existingUser) {
            return res.status(400).json({message: "User already exists"});
        }

        //create new user
        const user  = await  User.create({
            username,
            email,
            password,
            loggedIn: false
        });

        res.status(201).json({message: "User registered successfully", 
            user: {id: user._id, username: user.username, email: user.email}});

    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
}

const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        //check if user exists
        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        //compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({message: "Invalid credentials"});
        }
        user.loggedIn = true;
        await user.save();

        res.status(200).json({message: "Login successful", user: {id: user._id, username: user.username, email: user.email}});
    
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
}

const logoutUser = async (req, res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({email: email});
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }
        
        user.loggedIn = false;
        await user.save();
        res.status(200).json({message: "Logout successful"});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
}
export {registerUser, loginUser, logoutUser};