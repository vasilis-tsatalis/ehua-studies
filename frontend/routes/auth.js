const express = require('express');
//define an express method
const router = express.Router();

//----------ROUTES----------//

router.post('/', async (req, res) => {
    try{
        const { username, password } = req.body;

        username.toLowerCase();

          // check for missing filds
        if (!username || !password) {
            return res.render("signin", { message: "Please enter all the fields" });
        }

        // keycloak check
        // check also the role
        const doesUserExits = true;

        if (!doesUserExits) {
            res.send("invalid username or password");
            return;
        }

          // else he\s logged in
        req.session.user = {
            username,
        };

        // authentication with keycloak
        res.render("dashboard", {username});

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;