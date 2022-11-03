const express = require('express');
//define an express method
const router = express.Router();
const axios = require('axios');
const Feusers = require('../models/Feusers');

const authenticateUser = require("../middleware/auth/authentication");
const send_email = require("../tools/email/send_email")

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;
        const role = req.session.user.role;

        res.render("contact", {username, role});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


router.post('/', authenticateUser, async (req, res) => {
    try{

        const { email, subject, the_body } = req.body;

        const username = req.session.user.username;
        const role = req.session.user.role;

        const db_user = await Feusers.findOne({ username: `${username.toLowerCase()}` }).exec();

        if (db_user) {
            const sender = db_user.email;
            send_email(sender, email, subject, the_body);
        };

        res.render("contact", {username, role});

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;