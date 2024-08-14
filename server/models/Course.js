const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName:{
        type: String,
        required: true
    },
    courseDescription:{
        type: String,
        required: true
    },
    instructor:{
        type: mongoose.Types.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    whatYouWillLearn:{
        type: String,
    },
    courseContent:[{
        type: mongoose.Types.Schema.ObjectId,
        ref: 'Section'
    }],
    price:{
        type: Number,
        required: true
    },
    thumbnail:{
        type:String,
    },
    tag:{
        type:mongoose.Types.Schema.ObjectId,
        ref: 'Tag'
    },
    studentEnrolled:[{
        type: mongoose.Types.Schema.ObjectId,
        required: true,
        ref: 'User'
    }]
})


module.exports = mongoose.model('Course', courseSchema);