const express = require('express');
//define an express method
const router = express.Router();

const authenticateUser = require("../middleware/auth/authentication");
const get_backend = require("../requests/get_backend");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const semesters = [];
        const username = req.session.user.username;

        get_backend('/semesters_types')
        .then(data => {
            data.forEach(element => {
                semesters.push({id: element.id, name: element.name, description: element.description, start_time: element.start_time, days_time: element.days_time})
            });
            res.render("semesters", {semesters, username});
        })
        .catch(err => {
            console.log(err)
        });

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});




router.post('/', authenticateUser, async (req, res) => {
    try{
        res.render("semesters");
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;