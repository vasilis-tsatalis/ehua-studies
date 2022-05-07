const nodemailer = require('nodemailer');

require('dotenv/config');

// create transporter object with smtp server details
const transporter = nodemailer.createTransport({

    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASS
    }
    
});

// verify connection configuration
transporter.verify(function (error, success) {

    if (error) {
      console.log(error);
    } else {
      console.log("SMTP Server connection is ready for use");
    }

});


module.exports = transporter;
