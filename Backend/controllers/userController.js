import User from '../models/User.js'
import validator from 'validator';

export const getProfile = async (req, res) => {
    try{
        const userID = req.user._id;
        const user = await User.findById(userID);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error: error.message });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        
        // Validate inputs
        if (name && (typeof name !== 'string' || name.trim().length < 2)) {
            return res.status(400).json({ message: "Name must be at least 2 characters long" });
        }
        
        if (email && !validator.isEmail(email)) {
            return res.status(400).json({ message: "Valid email is required" });
        }
        
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        
        if (name) user.name = name.trim();
        if (email) user.email = email.toLowerCase().trim();

        await user.save();
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
}