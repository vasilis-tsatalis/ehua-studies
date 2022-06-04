const express = require('express');
//define an express method
const router = express.Router();
const axios = require('axios');

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

        // If user exists and authenticate in keycloak check it also in the backend
        await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/professors/username/${username}`, {
            auth: {
              username: `${process.env.API_USER}`,
              password: `${process.env.API_PASS}`
            }
          })
          .then(response => {
                const metadata = response.data;
                //console.log(metadata);
                const db_professor_id = metadata.id;
                req.session.user = {
                    username,
                    db_professor_id
                };
                res.render("dashboard", {username, db_professor_id});
                
          })
          .catch(err => { 
              console.log(err);
              //res.sendStatus(401).json({ message: "unauthorized" });
              res.send("invalid username or password");
            });
          ///////////

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;