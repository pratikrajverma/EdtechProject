const User = require("../models/User");
const mailSender = require("../utils/mailSender");

const resetPasswordToken = async (req, res) => {
    try {
        const { email } = req.user;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const token = crypto.randomUUID();

        const updatedUser = await User.findOneAndUpdate(email, {
            token: token,
            resetPasswordExpires: Date.now() + 5 * 60 * 1000,
        });

        const url = `https://localhost:3000/update-password/${token}`;

        await mailSender(email, "reset your password by link", `reset link${url}`);

        return res.status(200).json({
            success: true,
            message: "email send successfully to update password",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "somthing went wrong while reseting password",
        });
    }
};


const resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords and confirm  do not match" });
        }

        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(400).json({ message: "Token is invalid" });
        }

        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: "Token has expired" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });


        return res.status(200).json({
            success: true,
            message: "Password updated successfully",
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "somthing went wrong while reseting password",
        });
    }
}






module.exports = { resetPassword, resetPasswordToken };