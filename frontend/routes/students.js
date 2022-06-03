const express = require('express');
//define an express method
const router = express.Router();
const axios = require('axios');

const authenticateUser = require("../middleware/auth/authentication");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;
        res.render("students", {username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


router.get('/all', authenticateUser, async (req, res) => {
    try{

        const students = [];
        const username = req.session.user.username;

        await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/students`, {
            auth: {
              username: `${process.env.API_USER}`,
              password: `${process.env.API_PASS}`
            }
          })
          .then(response => {
                const metadata = response.data;
                //console.log(metadata);
                if (metadata.length == 0) {
                    res.render("students_list", {students, username});
                };
                metadata.forEach(element => {
                    students.push({id: element.id, username: element.username, first_name: element.first_name, 
                        last_name: element.last_name, date_of_birth: element.date_of_birth, address: element.address,
                        city: element.city, zipcode: element.zipcode, telephone: element.telephone, 
                        phone: element.phone, mobile: element.mobile, email: element.email, 
                        year_group: element.year_group, is_active: element.is_active, notes: element.notes
                        })
                });
                res.render("students_list", {students, username});
          })
          .catch(err => {
            console.log(err);
            res.render("students_list", {students, username});
          });

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


router.get('/sections', authenticateUser, async (req, res) => {
    try{

        const { the_student_id } = req.body;
        console.log(the_student_id)

        const students = [];
        const username = req.session.user.username;

        await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/students`, {
            auth: {
              username: `${process.env.API_USER}`,
              password: `${process.env.API_PASS}`
            }
          })
          .then(response => {
                const metadata = response.data;
                //console.log(metadata);
                if (metadata.length == 0) {
                    res.render("students_section", {students, username});
                };
                metadata.forEach(element => {

                    console.log(metadata)

                    students.push({id: element.id, username: element.username, first_name: element.first_name, 
                        last_name: element.last_name, date_of_birth: element.date_of_birth, address: element.address,
                        city: element.city, zipcode: element.zipcode, telephone: element.telephone, 
                        phone: element.phone, mobile: element.mobile, email: element.email, 
                        year_group: element.year_group, is_active: element.is_active, notes: element.notes
                        })
                });
                res.render("students_section", {students, username});
          })
          .catch(err => {
            console.log(err);
            res.render("students_section", {students, username});
          });

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;