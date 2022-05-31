const express = require('express');
//define an express method
const router = express.Router();
const axios = require('axios');

const authenticateUser = require("../middleware/auth/authentication");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const classrooms = [];
        const username = req.session.user.username;

        await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/classrooms_types`, {
            auth: {
              username: `${process.env.API_USER}`,
              password: `${process.env.API_PASS}`
            }
          })
          .then(response => {
                const metadata = response.data;
                //console.log(metadata);
                if (metadata.length == 0) {
                    res.render("classrooms", {classrooms, username});
                };
                metadata.forEach(element => {
                    classrooms.push({id: element.id, name: element.name, building: element.building, number: element.number, type: element.type});
                });
            res.render("classrooms", {classrooms, username});
          })
          .catch(err => {
            console.log(err);
            res.render("classrooms", {classrooms, username});
          });

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//export the router we have define above
module.exports = router;