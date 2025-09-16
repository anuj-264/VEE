import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password -__v");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error" });
    }
}



export const updateAssistant = async (req, res) => {
    try {
       
        const { assistantName, imageUrl } = req.body
        console.log(assistantName, imageUrl);
        let assistantImage;
        if (req.file) {
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
            
            assistantImage = cloudinaryResponse?.secure_url;
        } else {
            assistantImage = imageUrl
        }
        console.log(assistantImage);
        if (assistantImage == null) {
            return res.status(400).json({ message: "Error while uploading image" });
        }

        const updatedUser = await User.findByIdAndUpdate(req.userId, {
            assistantName, assistantImage
        }, { new: true }).select("-password -__v");

        return res.status(200).json(updatedUser)


    } catch (error) {
        return res.status(400).json({ message: "Error updating assistant", error: error.message })
    }
}