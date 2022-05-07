const express = require('express');
//define an express method
const router = express.Router();

const authenticateUser = require("../middleware/auth/authentication");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        res.render("results", {username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});




router.post('/', authenticateUser, async (req, res) => {
    try{
        res.render("results");
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;