const mongoose = require('mongoose');

require('dotenv').config()

const connectDB = async () => {
    try{
        mongoose.connect(process.env.databaseUrl);
        
        console.log('database connected successfully');
    }catch(e){
        console.log('failed to connect database');
        console.error(e.message);
        process.exit(1);
    }
}

module.exports = connectDB;