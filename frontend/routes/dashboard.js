const express = require('express');
//define an express method
const router = express.Router();

const authenticateUser = require("../middleware/auth/authentication");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{

        const username = req.session.user.username;
        const role = req.session.user.role;
        const ref_code = req.session.user.ref_code;
        res.render("dashboard", { username, role, ref_code });

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//export the router we have define above
module.exports = router;