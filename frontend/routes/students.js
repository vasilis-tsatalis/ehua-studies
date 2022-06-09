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
                    res.render("students_section", {sections, username});
                };
                metadata.forEach(element => {
                    sections.push({course_id: element.course_id, id: element.id, professor_id: element.professor_id, 
                        classroom_type_id: element.classroom_type_id, year: element.year, 
                        exam_type_id: element.exam_type_id
                                    })                
                    });
                res.render("students_section", {sections, username});
          })
          .catch(err => {
            console.log(err);
            res.render("students_section", {sections, username});
          });

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

        function axiosSectionStudents(id) {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/sections/${id}/students`, {
                auth: {
                  username: `${process.env.API_USER}`,
                  password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };

        function axiosStudent(id) {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/students/${id}`, {
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

        // check if session exists
        const section = await axiosSection(section_id);
        if (!section) {
            res.render("students_section", {username, section_id});
        }

        const student_sections = [];

        const students_section_ids = await axiosSectionStudents(section_id);

        if (students_section_ids.length == 0) {
            res.render("students_section", {username, section_id});
        }

        const classroom = await axiosClassroom(section.classroom_type_id);
        const course = await axiosCourse(section.course_id);
        const exam = await axiosExam(section.exam_type_id);

        console.log(students_section_ids);

        students_section_ids.forEach(item => {
            console.log(item);
            const student_id = item.student_id;
            //const section_id = item.section_id;
            const status = item.status;
            const results = item.results;
            const creation_user = item.creation_user;
            const creation_date = item.creation_date;
            const last_update_at = item.last_update_at;

            const student = axiosStudent(student_id);

            const year = section.year;

            const student_username = student.username;
            const student_fname = student.first_name;
            const student_sname = student.last_name;
            const student_email = student.email;
            const student_mobile = student.mobile;
            const student_year_group = student.year_group;
            const student_is_active = student.is_active;
            const student_notes = student.notes;
    
            const classroom_name = classroom.name;
            const classroom_number = classroom.number;
            const classroom_building = classroom.building;
            const classroom_type = classroom.type;
    
            const course_name = course.name;
            const course_description = course.description;
            const course_gravity = course.gravity;
    
            const exams_name = exam.name;
            const exams_gravity = exam.gravity;

            student_sections.push[{
                status: status,
                results: results,
                creation_user: creation_user,
                creation_date: creation_date,
                last_update_at: last_update_at,
                year: year,
                student_username: student_username,
                student_fname: student_fname,
                student_sname: student_sname,
                student_email: student_email,
                student_mobile: student_mobile,
                student_year_group: student_year_group,
                student_is_active: student_is_active,
                student_notes: student_notes,
    
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
        });


            console.log(student_sections);

            res.render("students_section", {student_sections, username, section_id});

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


router.get("/:studentID", authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        const student_id = req.params.studentID;

        await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/students/${student_id}`, {
            auth: {
              username: `${process.env.API_USER}`,
              password: `${process.env.API_PASS}`
            }
          })
          .then(response => {
                const metadata = response.data;
                //console.log(metadata);
                const student_username = metadata.username;
                const student_fname = metadata.first_name;
                const student_sname = metadata.last_name;
                const student_email = metadata.email;
                const student_mobile = metadata.mobile;
                const student_year_group = metadata.year_group;
                const student_is_active = metadata.is_active;
                const student_notes = metadata.notes;

                const student_data = {
                    student_username: student_username,
                    student_fname: student_fname,
                    student_sname: student_sname,
                    student_email: student_email,
                    student_mobile: student_mobile,
                    student_year_group: student_year_group,
                    student_is_active: student_is_active,
                    student_notes: student_notes
                };

                res.render("student_data", {student_data, username});
          })
          .catch(err => {
            console.log(err);
            res.render("students_section", {username});
          });

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;