const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    gender:{
     type:String,
    },
    dataOfBirth:{
     type: String,
    },
    contactNumber:{
     type:String,
    },
    about:{
        type: String,
    }
 })

module.exports = mongoose.model('Profile', profileSchema);