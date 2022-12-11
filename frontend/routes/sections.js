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

        res.render("sections", {username, role, ref_code});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


router.get('/selection', authenticateUser, async (req, res) => {
    try{

        const sections = [];
        const username = req.session.user.username;
        const role = req.session.user.role;
        const ref_code = req.session.user.ref_code;

        const val = req.query.val

        function axiosSections() {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/sections`, {
                auth: {
                  username: `${process.env.API_USER}`,
                  password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };

        function axiosProfessorSections(ref_code) {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/professors/${ref_code}/sections`, {
                auth: {
                  username: `${process.env.API_USER}`,
                  password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };

        function axiosClassrooms() {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/classrooms_types`, {
                auth: {
                  username: `${process.env.API_USER}`,
                  password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };

        function axiosExams() {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/exams_types`, {
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

        if (val == 'my') {
            var db_sections = await axiosProfessorSections(ref_code);
        } else if (val == 'all') {
            var db_sections = await axiosSections();
        };
        
        if (!db_sections) {
            res.render("sections_selection", {sections, username, role, ref_code});
        };

        const db_courses = await axiosCourses();
        if (!db_courses) {
            res.render("sections_selection", {sections, username, role, ref_code});
        };

        const db_classes = await axiosClassrooms();
        if (!db_classes) {
            res.render("sections_selection", {sections, username, role, ref_code});
        };

        const db_exams = await axiosExams();
        if (!db_exams) {
            res.render("sections_selection", {sections, username, role, ref_code});
        };

        db_sections.forEach(element => {
            db_courses.forEach(course => {
                if (course.id == element.course_id) {
                    db_classes.forEach(class_type => {
                        if (class_type.id == element.classroom_type_id){
                            db_exams.forEach(exam_type => {
                                if (exam_type.id == element.exam_type_id) {
                                    
                                    sections.push({section_id: element.id,
                                        course_name: course.name,
                                        classroom_name: class_type.name, classroom_type: class_type.type,
                                        exam_name: exam_type.name, exam_gravity: exam_type.gravity,
                                        section_year: element.year
                                    })  

                                }
                            });
                        }
                    });
                }
            });              
        });
        res.render("sections_selection", {sections, username, role, ref_code});

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


router.post('/students', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;
        const role = req.session.user.role;
        const ref_code = req.session.user.ref_code;

        const section_id = parseInt(req.body.section_id);

        const section_students_id = [];

        function axiosSectionStudents(id) {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/sections/${section_id}/students`, {
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
        if (!db_section_students) {
            res.render("students_section", {section_id, username, role, ref_code});
        };

        const db_students = await axiosStudents();
        if (!db_students) {
            res.render("students_section", {username, role, ref_code});
        };

        db_section_students.forEach(element => {
            db_students.forEach(student => {
                if (element.student_id == student.id) {
                    section_students_id.push({section_id: element.section_id, 
                        student_id: student.id, student_username: student.username, student_email: student.email,
                        status: element.status, results: element.results, 
                        creation_date: element.creation_date, last_update_at: element.last_update_at
                    });  
                }
            }); 
        });

        res.render("students_section", {section_students_id, username, section_id, role, ref_code});

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;