const express = require('express');
//define an express method
const router = express.Router();

const authenticateUser = require("../middleware/auth/authentication");
const get_backend = require("../requests/get_backend");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const docs_types = [];
        const username = req.session.user.username;

        get_backend('/documents_types')
        .then(data => {

            // if (!data.length()) {
            //     res.render("docs_types", {docs_types, username});
            // };

            data.forEach(element => {
                docs_types.push({id: element.id, name: element.name, description: element.description})
            });
            res.render("docs_types", {docs_types, username});
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