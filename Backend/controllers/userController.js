import User from '../models/User.js'

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
        const {name, email} = req.body;
        const user = await User.findByIdAndUpdate(req.user._id);

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        user.name = name || user.name;
        user.email = email || user.email;

        await user.save();
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error: error.message });
    }
}