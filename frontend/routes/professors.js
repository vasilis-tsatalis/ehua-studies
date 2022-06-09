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
        const sections = [];
        const username = req.session.user.username;

        await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/sections`, {
            auth: {
              username: `${process.env.API_USER}`,
              password: `${process.env.API_PASS}`
            }
          })
          .then(response => {
                const metadata = response.data;
                //console.log(metadata);
                if (metadata.length == 0) {
                    res.render("professors_section", {sections, username});
                };
                metadata.forEach(element => {
                    sections.push({course_id: element.course_id, id: element.id, professor_id: element.professor_id, 
                        classroom_type_id: element.classroom_type_id, year: element.year, 
                        exam_type_id: element.exam_type_id
                                    })                
                    });
                res.render("professors_section", {sections, username});
          })
          .catch(err => {
            console.log(err);
            res.render("professors_section", {sections, username});
          });

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});



router.post('/sections', authenticateUser, async (req, res) => {
    try{

        const username = req.session.user.username;
        const section_id = parseInt(req.body.section_id);

        function axiosSection(id) {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/sections/${id}`, {
                auth: {
                  username: `${process.env.API_USER}`,
                  password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };

        function axiosProfessor(id) {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/professors/${id}`, {
                auth: {
                    username: `${process.env.API_USER}`,
                    password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };

        function axiosClassroom(id) {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/classrooms_types/${id}`, {
                auth: {
                username: `${process.env.API_USER}`,
                password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };

        function axiosCourse(id) {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/courses/${id}`, {
                auth: {
                username: `${process.env.API_USER}`,
                password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };

        function axiosExam(id) {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/exams_types/${id}`, {
                auth: {
                username: `${process.env.API_USER}`,
                password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };


        const section = await axiosSection(section_id);
        if (!section) {
            res.render("professors_section", {username, section_id});
        }
        const professor = await axiosProfessor(section.professor_id);
        const classroom = await axiosClassroom(section.classroom_type_id);
        const course = await axiosCourse(section.course_id);
        const exam = await axiosExam(section.exam_type_id);

        const year = section.year;

        const professor_username = professor.username;
        const professor_fname = professor.first_name;
        const professor_sname = professor.last_name;
        const professor_email = professor.email;
        const professor_ophone = professor.office_phone;
        const professor_mobile = professor.mobile;
        const professor_title = professor.title;
        const professor_level = professor.level;

        const classroom_name = classroom.name;
        const classroom_number = classroom.number;
        const classroom_building = classroom.building;
        const classroom_type = classroom.type;

        const course_name = course.name;
        const course_description = course.description;
        const course_gravity = course.gravity;

        const exams_name = exam.name;
        const exams_gravity = exam.gravity;


        const professor_sections = [{
            year: year,
            professor_username: professor_username,
            professor_fname: professor_fname,
            professor_sname: professor_sname,
            professor_email: professor_email,
            professor_ophone: professor_ophone,
            professor_mobile: professor_mobile,
            professor_title: professor_title,
            professor_level: professor_level,

            classroom_name: classroom_name,
            classroom_number: classroom_number,
            classroom_building: classroom_building,
            classroom_type: classroom_type,

            course_name: course_name,
            course_description: course_description,
            course_gravity: course_gravity,

            exams_name: exams_name,
            exams_gravity: exams_gravity
        }];

        //console.log(professor_section);

        res.render("professors_section", {professor_sections, username, section_id});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;