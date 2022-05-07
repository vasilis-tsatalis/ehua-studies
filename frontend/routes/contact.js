const express = require('express');
//define an express method
const router = express.Router();

const authenticateUser = require("../middleware/auth/authentication");
const send_email = require("../tools/email/send_email")

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;
        res.render("contact", {username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


router.post('/', authenticateUser, async (req, res) => {
    try{

        const { email, subject, the_body } = req.body;

        const username = req.session.user.username;

        // receive username logged in email
        const sender = 'vtsat@programmer.net';

        send_email(sender, email, subject, the_body);

        res.render("contact", {username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;