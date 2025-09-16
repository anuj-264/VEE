import User from "../models/user.model.js";
import hashPassword from "../utils/hasshPassword.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";


export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        //hash the password
        const hashedPassword = await hashPassword(password);
        //create user
        const user = await User.create({ name, email, password: hashedPassword });
        // generate JWT token
        const token = generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true, // Set to true if using HTTPS
        });
        const createdUser = await User.findById(user._id).select("-password -_v");
        //send response
        return res.status(201).json({ message: "User created successfully", createdUser });
    } catch (error) {
        return res.status(500).json({ message: "Error Signing Up", error });
    }
};


export const logIn = async (req, res) => {
    try {
        const { email, password: plainTextPassword } = req.body;
        if (!email || !plainTextPassword) {
            return res.status(400).json({ message: "Both email and password are required" });
        }


        const existingUser = await User.findOne({ email });


        if (!existingUser) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordMatch = await bcrypt.compare(plainTextPassword, existingUser.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = generateToken(existingUser._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            sameSite: "None",
            secure: true, // Set to true if using HTTPS
        });

        return res.status(200).json({
            message: "User Logged In successfully",
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return res.status(500).json({ message: "Error logging in" });
    }
};
export const logOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error logging out", error });
    }
};
