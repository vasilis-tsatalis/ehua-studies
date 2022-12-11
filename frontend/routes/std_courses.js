const express = require('express');
//define an express method
const router = express.Router();
const axios = require('axios');
const Feusers = require('../models/Feusers');

const authenticateUser = require("../middleware/auth/authentication");

//----------ROUTES----------//
router.get('/', authenticateUser, async (req, res) => {
    try{

        const courses = [];
        const sections = [];
        const username = req.session.user.username;
        const role = req.session.user.role;
        const ref_code = parseInt(req.session.user.ref_code);

        function axiosStudentSections(id) {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/students/${id}/sections`, {
                auth: {
                  username: `${process.env.API_USER}`,
                  password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };

        function axiosSections() {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/sections`, {
                auth: {
                  username: `${process.env.API_USER}`,
                  password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };

        function axiosCourses() {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/courses`, {
                auth: {
                  username: `${process.env.API_USER}`,
                  password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };

        function axiosSemesters() {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/semesters_types`, {
                auth: {
                  username: `${process.env.API_USER}`,
                  password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };

        const db_sections_students = await axiosStudentSections(ref_code);
        if (db_sections_students.length == 0) {
            res.render("std_courses", {username, role, ref_code});
        };

        const db_sections = await axiosSections();
        if (db_sections.length == 0) {
            res.render("std_courses", {username, role, ref_code});
        };

        const db_courses = await axiosCourses();
        if (db_courses.length == 0) {
            res.render("std_courses", {username, role, ref_code});
        };

        const db_semester_types = await axiosSemesters();
        if (db_semester_types.length == 0) {
            res.render("std_courses", {username, role, ref_code});
        };


        db_sections_students.forEach(std_section => {
            //console.log(std_section.section_id)
            db_sections.forEach(section => {
                //console.log(section.id);
                if (std_section.section_id == section.id) {
                    db_courses.forEach(course => {
                        if (section.course_id == course.id) {
                            //console.log(course.id);
                            db_semester_types.forEach(semester_type => {
                                if (semester_type.id == course.semester_type_id) {
                                    courses.push({id: course.id, name: course.name, 
                                        description: course.description, is_active: course.is_active, gravity: course.gravity, section_id: section.id,
                                        semester_type_desc: semester_type.description, semester_type_strd: semester_type.start_date, 
                                        semester_type_endd: semester_type.end_date
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });


        res.render("std_courses", {courses, username, role, ref_code});

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//export the router we have define above
module.exports = router;