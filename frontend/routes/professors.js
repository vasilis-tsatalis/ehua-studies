const express = require('express');
//define an express method
const router = express.Router();
const axios = require('axios');

const authenticateUser = require("../middleware/auth/authentication");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;
        res.render("professors", {username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

router.get('/all', authenticateUser, async (req, res) => {
    try{
        const professors = [];
        const username = req.session.user.username;

        await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/professors`, {
            auth: {
              username: `${process.env.API_USER}`,
              password: `${process.env.API_PASS}`
            }
          })
          .then(response => {
                const metadata = response.data;
                //console.log(metadata);
                if (metadata.length == 0) {
                    res.render("professors_list", {professors, username});
                };
                metadata.forEach(element => {
                    professors.push({id: element.id, username: element.username, first_name: element.first_name, 
                        last_name: element.last_name, date_of_birth: element.date_of_birth, address: element.address, 
                        city: element.city, zipcode: element.zipcode, telephone: element.telephone, 
                        office_phone: element.office_phone, mobile: element.mobile, email: element.email, 
                        title: element.title, level: element.level, is_active: element.is_active, notes: element.notes
                                    })
                    });
                res.render("professors_list", {professors, username});
          })
          .catch(err => {
            console.log(err);
            res.render("professors_list", {professors, username});
          });
   
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

router.get('/sections', authenticateUser, async (req, res) => {
    try{
        const professors = [];
        const username = req.session.user.username;


        await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/professors/username/${username}`, {
            auth: {
              username: `${process.env.API_USER}`,
              password: `${process.env.API_PASS}`
            }
          })
          .then(response => {
                const metadata = response.data;
                //console.log(metadata);
                const professor_id = metadata.id
                console.log(professor_id);
                professors.push({id: metadata.id, username: metadata.username})

                res.render("professors_section", {professors, username});
          })
          .catch(err => {
            console.log(err);
            res.render("professors_section", {professors, username});
          });


        //   professors.push({id: metadata.id, username: metadata.username, first_name: metadata.first_name, 
        //     last_name: metadata.last_name, date_of_birth: metadata.date_of_birth, address: metadata.address, 
        //     city: metadata.city, zipcode: metadata.zipcode, telephone: metadata.telephone, 
        //     office_phone: metadata.office_phone, mobile: metadata.mobile, email: metadata.email, 
        //     title: metadata.title, level: metadata.level, is_active: metadata.is_active, notes: metadata.notes
        //                 })



        // data.forEach(element => {
        //     professors.push({section_id: element.section_id, id: element.id, username: element.username, first_name: element.first_name, 
        //         last_name: element.last_name, office_phone: element.office_phone, mobile: element.mobile, 
        //         email: element.email, title: element.title, level: element.level
        //                     })
        // });

        //res.render("professors_section", {professors, username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;