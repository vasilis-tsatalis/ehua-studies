const express = require('express');
//define an express method
const router = express.Router();

const authenticateUser = require("../middleware/auth/authentication");
const get_backend = require("../requests/get_backend");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const schedulers = [];
        const username = req.session.user.username;

        get_backend('/schedulers_types')
        .then(data => {
            data.forEach(element => {
                schedulers.push({id: element.id, name: element.name, day: element.day, start_time: element.start_time, end_time: element.end_time})
            });
            res.render("schedulers", {schedulers, username});
        })
        .catch(err => {
            console.log(err)
        });
        
    } catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//export the router we have define above
module.exports = router;