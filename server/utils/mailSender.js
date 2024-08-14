const nodemailer = require('nodemailer');
require('dotenv').config()

const mailSender = async (email,title, body ) => {
    try{
            let transport = nodemailer.createTransport({
                host: process.env.MAIL_HOST ,
                
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS 
                }
            });


            const info = await transport.sendMail({
                from: 'StudyNotion',
                to: `${email}`,
                subject: `${title}`,
                html: `${body}`
            });


            return info

    }catch(err){
        console.log('error in sending email')
        console.error(err.message)
    }
}   

module.exports = mailSender;