const Profile = require("../models/Profile");
const User = require("../models/User");

const updateProfile = async (req, res) => {
    try {
        const { dateOfBirth, about, gender, contactNumber } = req.body;

        const id = req.user.id;

        //validation
        if (!gender || !contactNumber || dateOfBirth || about) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields for update profile",
            });
        }

        //fetching user details
        const userDetails = await User.findById(id);

        //updating profile details
        const profileId = userDetails.additional;

        const updatedProfile = await Profile.findByIdAndUpdate(
            profileId,
            { dateOfBirth, about, gender, contactNumber },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            updatedProfile,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "somthig went wrong while updating profile",
        });
    }
};

// NOTE : we can also shedule our account deletion process due to safty
const deleteAccount = async (req, res) => {
    try {
        //fetch user Id
        const userId = req.user.id;

        //validation
        const userDetails = await User.findById(userId);

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "user not found",
            });
        }

        await Profile.findByIdAndDelete({ _id: userDetails.additional });

        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "somthig went wrong while deleting account",
        });
    }
};

const getAllUserDetails = async (req, res) => {
    try {
        const userId = req.user.id;

        const userDetails = await User.findById(userId)
            .populate("additional")
            .exec();

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "user not found",
            });

        }
            return res.status(200).json({
                success: true,
                message: "User details fetched successfully",
                userDetails,
            });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "somthig went wrong while getting user details",
        });
    }
};

module.exports = { updateProfile, deleteAccount, getAllUserDetails };
