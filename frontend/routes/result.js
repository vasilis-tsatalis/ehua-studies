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
        const ref_code = req.session.user.ref_code;
        //console.log(req.session.user);
        const sections = [];

        function axiosSections(ref_code) {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/professors/${ref_code}/sections`, {
                auth: {
                  username: `${process.env.API_USER}`,
                  password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };

        const db_sections = await axiosSections(ref_code);

        if (!db_sections) {
            res.render("results", {username, role, ref_code});
        };

        db_sections.forEach(section => {
            if (ref_code == section.professor_id) {
                sections.push({
                    id: section.id,
                    course_id: section.course_id,
                    year: section.year
                });
            };
        });

        res.render("results", {sections, username, role, ref_code});

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

router.post('/', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;
        const role = req.session.user.role;
        const ref_code = req.session.user.ref_code;

        const section_id = parseInt(req.body.section_id);
        const section_students = [];

        function axiosSectionStudents(id) {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/sections/${id}/students`, {
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

        const db_section_students = await axiosSectionStudents(section_id);
        const db_students = await axiosStudents();

        if (!db_section_students) {
            res.render("results", {username, role, ref_code});
        };

        if (!db_students) {
            res.render("dashboard", {username, role, ref_code});
        };

        db_section_students.forEach(element => {

            db_students.forEach(item =>{

                if (item.id === element.student_id) {
                    section_students.push({
                        section_id: element.section_id,
                        student_id: element.student_id,
                        username: item.username,
                        first_name: item.first_name,
                        last_name: item.last_name,
                        points: element.status
        
                    });
                }
            })
        });

        res.render("results_points", {section_students, username, role, ref_code});

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

router.post('/points', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;
        const role = req.session.user.role;
        const ref_code = req.session.user.ref_code;

        const { status, section_id, student_id } = req.body;

        if (status >= 5) {
            var results = 'Pass';
        } else {
            var results = 'Failed';
        };

        const api_url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/sections/students`;    

        const metadata = {
            student_id: student_id,
            section_id: section_id,
            status: status,
            results: results,
        };

        await axios.put(api_url, metadata, {
            auth: {
                username: `${process.env.API_USER}`,
                password: `${process.env.API_PASS}`
            }
        })
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });

        res.render("students", {username, role, ref_code});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//export the router we have define above
module.exports = router;