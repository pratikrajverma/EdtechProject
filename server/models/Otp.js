const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const otpSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    otp:{
        type: Number,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires:5*60
    }
})


async function sendVerificaitonEmail(email, otp){
    try{
        const mailRespose = await mailSender(email, "Verification form StudyNotion", otp);
        console.log('Email sent successfully', mailRespose)
    }catch(error){
        console.log('error occured while sending otp', error);
        throw error;
    }
}

otpSchema.pre('save', async(next) =>{
    await sendVerificaitonEmail(this.email, this.otp);
    next();
})





module.exports = mongoose.model('Otp', otpSchema);