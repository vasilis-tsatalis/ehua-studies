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
        const ref_code = req.session.user.ref_code;

        function axiosCourses() {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/courses`, {
                auth: {
                  username: `${process.env.API_USER}`,
                  password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };

        function axiosDepartments() {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/departments`, {
                auth: {
                  username: `${process.env.API_USER}`,
                  password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };

        const db_courses = await axiosCourses();
        if (!db_courses) {
            res.render("courses", {courses, username, role, ref_code});
        };

        // const db_departments = await axiosDepartments();
        // if (!db_departments) {
        //     res.render("courses", {courses, username, role});
        // };

        db_courses.forEach(db_course => {

            // const containsDepartment = !!db_departments.find(db_department => {
            //     return db_department.id === db_course.department_id
            // });

            //if (containsDepartment) {
            //    var output = db_departments.filter(function(value) { return value.description})

            //    courses.push({id: db_course.id, department_id: db_course.department_id, name: db_course.name, 
            //        description: db_course.description, is_active: db_course.is_active, gravity: db_course.gravity, department_desc: department_desc
            //    });

            //}

            courses.push({id: db_course.id, name: db_course.name, 
                description: db_course.description, is_active: db_course.is_active, gravity: db_course.gravity
            });

        });
        //console.log(courses)
        res.render("courses", {courses, username, role, ref_code});

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;