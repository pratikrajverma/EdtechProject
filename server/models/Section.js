const mongoose = require('mongoose');

const section = new mongoose.Section({
    sectionName:{
        type:String,
        required:true
    },
    subSection:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubSection',
        required:true
    }]
})

module.exports = mongoose.model('Section', section);