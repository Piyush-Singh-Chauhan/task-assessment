import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import validator from 'validator';

const genereateToken = (user) => {
    return jwt.sign(
        { id: user._id},
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Helper function to validate input
const validateUserInput = (name, email, password) => {
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return { isValid: false, message: "Name must be at least 2 characters long" };
    }
    
    if (!email || typeof email !== 'string' || !validator.isEmail(email)) {
        return { isValid: false, message: "Valid email is required" };
    }
    
    if (!password || typeof password !== 'string' || password.length < 6) {
        return { isValid: false, message: "Password must be at least 6 characters long" };
    }
    
    return { isValid: true };
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body; 
        
        // Validate input
        const validation = validateUserInput(name, email, password);
        if (!validation.isValid) {
            return res.status(400).json({ message: validation.message });
        }

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
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
        console.error('Registration error:', error);
        res.status(500).json({ message: "SignUP Failed", error: error.message });
    }       
};

export const login = async (req, res) => {
    try { 
        const {email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "All fields are required" });        
        }
        
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Valid email is required" });
        }

        const user = await User.findOne({email: email.toLowerCase().trim()});
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
        console.error('Login error:', error);
        res.status(500).json({ message: "Login Failed", error: error.message });
    }
};