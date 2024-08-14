const mongoose = require('mongoose');

const subSectionSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    duration:{
        type: String,
    },
    discription:{
        type: String,
    },
    videoUrl:{
        type: String,
    }
})

module.exports = mongoose.model('SubSection', subSectionSchema);