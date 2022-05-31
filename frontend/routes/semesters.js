const express = require('express');
//define an express method
const router = express.Router();
const axios = require('axios');

const authenticateUser = require("../middleware/auth/authentication");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const semesters = [];
        const username = req.session.user.username;

        await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/semesters_types`, {
            auth: {
              username: `${process.env.API_USER}`,
              password: `${process.env.API_PASS}`
            }
          })
          .then(response => {
                const metadata = response.data;
                //console.log(metadata);
                if (metadata.length == 0) {
                    res.render("semesters", {semesters, username});
                };
                metadata.forEach(element => {
                    semesters.push({id: element.id, name: element.name, description: element.description, start_date: element.start_date, end_date: element.end_date})
                });
            res.render("semesters", {semesters, username});
          })
          .catch(err => {
            console.log(err);
            res.render("semesters", {semesters, username});
          });

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;