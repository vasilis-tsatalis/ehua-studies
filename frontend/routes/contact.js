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

        let username = req.session.user.username;

        await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/professors/username/${username}`, {
            auth: {
              username: `${process.env.API_USER}`,
              password: `${process.env.API_PASS}`
            }
          })
          .then(response => {
                const metadata = response.data;
                console.log(metadata);
                if (metadata.length == 0) {
                    res.render("contact", {username});
                };

                    // receive username logged in email
                    const sender = metadata.email;
                    send_email(sender, email, subject, the_body);
                    res.render("dashboard", {username});
          })
          .catch(err => {
            console.log(err);
            res.render("contact", {username});
          });

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;