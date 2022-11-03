const express = require('express');
//define an express method
const router = express.Router();
const axios = require('axios');

const authenticateUser = require("../middleware/auth/authentication");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;
        const role = req.session.user.role;
        //const sections = [];
        //const students = [];
        const ref_code = req.session.user.ref_code;

        function axiosSections() {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/professors/${ref_code}/sections`, {
                auth: {
                  username: `${process.env.API_USER}`,
                  password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };

        function axiosStudents() {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/students`, {
                auth: {
                    username: `${process.env.API_USER}`,
                    password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };

        console.log('before sections call')
        const sections = await axiosSections();
        //console.log(sections)
        console.log('before students call')
        const students = await axiosStudents();
        //console.log(students)
        res.render("results", {sections, students, username, role});

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});




router.post('/', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;
        const role = req.session.user.role;

        const { status, section_id, student_id } = req.body;

        console.log(status, section_id, student_id)

        res.render("results", {username, role});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;