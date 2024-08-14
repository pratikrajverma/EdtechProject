const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        enum: ["Admin", "Student", "Instructor"],
        required: true,
    },
    additional: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
    },
    image: {
        type: String,
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
    ],
    
    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: CourseProgress,
        },
    ],

    token:{
        type: String,
    },
    resetPasswordExpires:{
        type: Date
    }
});

module.exports = mongoose.model("User", userSchema);