const express = require('express');
//define an express method
const router = express.Router();
const axios = require('axios');
const Feusers = require('../models/Feusers');

require('dotenv/config');

//----------ROUTES----------//

router.post('/', async (req, res) => {

    try{
        const { username, password } = req.body;

        username.toLowerCase();

          // check for missing filds
        if (!username || !password) {
            return res.render("signin", { message: "Please enter all the fields" });
        }

        //////////////////////////////////////////////
        const db_user = await Feusers.findOne({ username: `${username.toLowerCase()}` }).exec();
        //console.log(db_user);

        if ((username === db_user.username) || (password === db_user.password)) {

            const ref_code = db_user.ref_code;
            const role = db_user.role;
            //console.log(db_user);

            req.session.user = {
              username,
              ref_code,
              role,
            };
            
            console.log(req.session.user)
            res.render("dashboard", {username, role});
            
        } else {
          res.render("signin", { message: "Username or password has error" });
        };
        ///////////

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;