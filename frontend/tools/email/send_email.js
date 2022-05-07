const transporter = require('./config');

// send email function
module.exports = function send_email(sender, receiver, subject='', body='') {

    transporter.sendMail({

      from: sender,
      to: receiver,
      subject: subject,
      html: body

  });

};
