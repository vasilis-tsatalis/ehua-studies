const express = require('express');
//define an express method
const router = express.Router();

const authenticateUser = require("../middleware/auth/authentication");
const get_backend = require("../requests/get_backend");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const exams = [];
        const username = req.session.user.username;

        get_backend('/exams_types')
        .then(data => {
            data.forEach(element => {
                exams.push({id: element.id, name: element.name, gravity: element.gravity})
            });
            res.render("exams", {exams, username});
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