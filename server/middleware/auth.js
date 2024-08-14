const jwt = require('jsonwebtoken');
require('dotenv').config()
const User = require('../models/User');


const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.body.token || req.header('Authorization').replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Token is missing' });
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;

        } catch (e) {
            return res.status(401).json({ message: 'Token is invalid' });
        }

        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'failed to authenticate user' });
    }
}





const isStudent = async (req, res, next) => {
    try{
        if(req.user.accountType !== 'Student') {
            return res.status(401).json({
                success: false,
                message: 'You are not a student'
            })
        }


        next();  

    }catch(error){
        return res.status(401).json({ message: "failed to verify user AccountType" });
    }
}

const isInstructor = async (req, res, next) => {
    try{
        if(req.user.accountType !== 'Instructor') {
            return res.status(401).json({
                success: false,
                message: 'You are not a Instructor'
            })
        }


        next();  

    }catch(error){
        return res.status(401).json({ message: "failed to verify user AccountType" });
    }
}



const isAdmin = async (req, res, next) => {
    try{
        if(req.user.accountType !== 'Admin') {
            return res.status(401).json({
                success: false,
                message: 'You are not a Admin'
            })
        }


        next();  

    }catch(error){
        return res.status(401).json({ message: "failed to verify user AccountType" });
    }
}




module.exports = {auth, isAdmin , isInstructor,  isStudent};