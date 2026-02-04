import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const genereateToken = (user) => {
    return jwt.sign(
        { id: user._id},
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}   

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body; 
        
        if(!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        };

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully",    
            token : genereateToken(user._id),
            user: {
                id: user._id,
                name: user.name,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "SignUP Failed", error: error.message });
    }       
};

export const login = async (req, res) => {
    try { 
        const {email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "All fields are required" });        

        }

        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({message: "Invalid credentials"});
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        res.status(200).json({
            message: "Login successful",
            token: genereateToken(user),
            user: {
                id: user._id,
                name: user.name,
            },
        });

        } catch (error) {
        res.status(500).json({ message: "Login Failed", error: error.message });
    }
}