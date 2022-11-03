const express = require('express');
//define an express method
const router = express.Router();
const axios = require('axios');

const authenticateUser = require("../middleware/auth/authentication");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const schedulers = [];
        const username = req.session.user.username;
        const role = req.session.user.role;

        await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/schedulers_types`, {
            auth: {
              username: `${process.env.API_USER}`,
              password: `${process.env.API_PASS}`
            }
          })
          .then(response => {
                const metadata = response.data;
                //console.log(metadata);
                if (metadata.length == 0) {
                    res.render("schedulers", {schedulers, username, role});
                };
                metadata.forEach(element => {
                    schedulers.push({id: element.id, name: element.name, day: element.day, start_time: element.start_time, end_time: element.end_time})
                });
            res.render("schedulers", {schedulers, username, role});
          })
          .catch(err => {
            console.log(err);
            res.render("schedulers", {schedulers, username, role});
          });
        
    } catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//export the router we have define above
module.exports = router;