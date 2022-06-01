const express = require('express');
//define an express method
const router = express.Router();
const axios = require('axios');

const authenticateUser = require("../middleware/auth/authentication");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/professors/username/${username}`, {
            auth: {
              username: `${process.env.API_USER}`,
              password: `${process.env.API_PASS}`
            }
          })
          .then(response => {
                const metadata = response.data;
                //console.log(metadata);
                const first_name = metadata.first_name;
                const last_name = metadata.last_name;
                const email = metadata.email;
                res.render("account", {username, first_name, last_name, email});
          })
          .catch(err => {
            console.log(err);
            res.render("account", {username, first_name, last_name, email});
          });



        // const first_name = 'Vasilis';
        // const last_name = 'Tsatalis';
        // const email = 'itp20138@hua.gr';

        //res.render("account", {username, first_name, last_name, email});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


router.post('/', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        res.render("account", {username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;