const express = require('express');
//define an express method
const router = express.Router();
const axios = require('axios');

const authenticateUser = require("../middleware/auth/authentication");


//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{

        const courses = [];
        const username = req.session.user.username;
        const role = req.session.user.role;

         
          await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/courses`, {
            auth: {
              username: `${process.env.API_USER}`,
              password: `${process.env.API_PASS}`
            }
          })
          .then(response => {
                const metadata = response.data;
                //console.log(metadata);
                if (metadata.length == 0) {
                    res.render("courses", {courses, username, role});
                };
                metadata.forEach(element => {

                  var dept = axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/departments/${element.department_id}`, {
                    auth: {
                      username: `${process.env.API_USER}`,
                      password: `${process.env.API_PASS}`
                    }
                  });

                    courses.push({id: element.id, department_id: element.department_id, name: element.name, 
                        description: element.description, is_active: element.is_active, gravity: element.gravity,
                        department_desc: dept.description
                        })                
                        });
            res.render("courses", {courses, username, role});
          })
          .catch(err => {
            console.log(err);
            res.render("courses", {courses, username, role});
          });

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;