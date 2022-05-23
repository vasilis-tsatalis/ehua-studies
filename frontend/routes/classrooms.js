const express = require('express');
//define an express method
const router = express.Router();

const authenticateUser = require("../middleware/auth/authentication");
const get_backend = require("../requests/get_backend");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const classrooms = [];
        const username = req.session.user.username;

        get_backend('/classrooms_types')
        .then(data => {

            if (!data) {
                res.render("classrooms", {classrooms, username});
            }

            data.forEach(element => {
                //console.log(element)
                classrooms.push({id: element.id, name: element.name, building: element.building, number: element.number, type: element.type});
            });
            res.render("classrooms", {classrooms, username});
        })
        .catch(err => {
            console.log(err)
        });

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//export the router we have define above
module.exports = router;