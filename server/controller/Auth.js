const User = require("../models/User");
const Otp = require("../models/Otp");
const otpGenerator = require("otp-generator");
const Profile = require("../models/Profile");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const mailSender = require("../utils/mailSender");

//send otp
const sendOtp = async (req, res) => {
    try {
        const { email } = req.email;

        if(!email){
            return res.status(400).json({ message: "Email is required for otp creation" });
        }

        const checkUserpresent = User.findOne({ email: email });

        if (checkUserpresent) {
            return res.status(401).json({
                success: false,
                message: "User already exist",
            });
        }

        //generate otp

        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            numbers: true,
            symbols: false,
            specialChars: false,
        });

        //check unique otp
        let checkOtpPresent = await Otp.findOne({ otp: otp });

        while (checkOtpPresent) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                numbers: true,
                symbols: false,
                specialChars: false,
            });

            checkOtpPresent = await Otp.findOne({ otp: otp });
        }

        console.log("otp generated", otp);

     

        const response = await Otp.create({ email, otp });

        console.log("otp sended to data base response", response);

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            response
        });

    } catch (error) {
        console.log("failed to create otp");
        res.status(500).json({
            success: false,
            message: "failed to create otp",
            error,
        });
    }
};

//signup

const signup = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp,
        } = req.body;

        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword ||
            !otp
        ) {
            return res.status(403).json({
                success: false,
                message: "All fields are required for signup",
            });
        }

        const userExist = User.findOne({ email: email });

        if (userExist) {
            return res.status(400).json({
                success: false,
                message: "User already exist",
            });
        }

        if (password !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "Passwords and confirm password  do not match",
            });
        }

        const recentOtpDocument = await Otp.findOne({ email: email })
            .sort({ createdAt: -1 })
            .limit(1);

        const recentOtp = recentOtpDocument ? recentOtpDocument.otp : 0;

        if (recentOtp === 0) {
            return res.status(403).json({
                success: false,
                message: "No otp found",
            });
        } else if (otp !== recentOtp) {
            return res.status(403).json({
                success: false,
                message: "Invalid OTP",
            });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        const profileDetail = await Profile.create({
            gender: null,
            dataOfBirth: null,
            contactNumber: null,
            about: null,
        });

        const user = await User.create({
            firstname: firstName,
            lastname: lastName,
            email: email,
            password: hashedPassword,

            accountType: accountType,
            additional: profileDetail._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        res.status(200).json({
            success: true,
            message: "Account created successfully",
            user,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create account",
            error,
        });
    }
};

//login

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required for login",
            });
        }

        const user = User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                id: user._id,
                email: user.email,
                accountType: user.accountType,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });

            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpsOnly: true,
            };

            return res.cookie("token", token, options).status(200).json({
                success: true,
                message: "Login successfully",
                user,
                token,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to login",
            error,
        });
    }
};

//reset password
const changePassword = async (req, res) => {
    try {
        const { oldpassword, confirmPassword, newpassword, user } = req.body;

        if (!oldpassword || !newpassword || !confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "All fields are required for change password",
            });
        }

        if (newpassword !== confirmPassword) {
            return res.status(403).json({
                success: false,
                message: "New password and confirm password do not match",
            });
        }

        const hashedPassword = await bcrypt.hash(newpassword, 10);

        const updatedPassword = await User.findByIdAndUpdate(
              user._id ,
            { password: hashedPassword },
            { new: true }
        );

        await mailSender(
            updatedPassword.email,
            "You Password has changed Successfully",
            "you can login with your new psswrod, Thank you"
        );

        res.status(200).json({
            success: true,
            message: ` Password reset successfully ,${updatedPassword.password}`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to reset password",
            error,
        });
    }
};

module.exports = { sendOtp, signup, login, changePassword };
