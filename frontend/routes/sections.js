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


router.get('/myselection', authenticateUser, async (req, res) => {
    try{

        const sections = [];
        const username = req.session.user.username;
        const role = req.session.user.role;
        const ref_code = req.session.user.ref_code;

        function axiosProfessorSections(ref_code) {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/professors/${ref_code}/sections`, {
                auth: {
                  username: `${process.env.API_USER}`,
                  password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };


        const db_sections = await axiosProfessorSections(ref_code);
        if (!db_sections) {
            res.render("sections_selection", {sections, username, role, ref_code});
        };

        db_sections.forEach(element => {
            sections.push({course_id: element.course_id, id: element.id, professor_id: element.professor_id, 
                classroom_type_id: element.classroom_type_id, year: element.year, 
                exam_type_id: element.exam_type_id
                            })                
            });
        res.render("sections_selection", {sections, username, role, ref_code});

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


router.get('/genselection', authenticateUser, async (req, res) => {
    try{

        const sections = [];
        const username = req.session.user.username;
        const role = req.session.user.role;
        const ref_code = req.session.user.ref_code;

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
                    res.render("sections_selection", {sections, username, role, ref_code});
                };
                metadata.forEach(element => {
                    sections.push({course_id: element.course_id, id: element.id, professor_id: element.professor_id, 
                        classroom_type_id: element.classroom_type_id, year: element.year, 
                        exam_type_id: element.exam_type_id
                                    })                
                    });
                res.render("sections_selection", {sections, username, role, ref_code});
          })
          .catch(err => {
            console.log(err);
            res.render("sections_selection", {sections, username, role, ref_code});
          });

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

        await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/sections/${section_id}/students`, {
            auth: {
              username: `${process.env.API_USER}`,
              password: `${process.env.API_PASS}`
            }
          })
          .then(response => {
                const metadata = response.data;
                //console.log(metadata);
                if (metadata.length == 0) {
                    res.render("students_section", {username, section_id, role, ref_code});
                };
                metadata.forEach(element => {
                    section_students_id.push({student_id: element.student_id, section_id: element.section_id, 
                        status: element.status, results: element.results, creation_user: element.creation_user, 
                        creation_date: element.creation_date, last_update_at: element.last_update_at
                        })                
                    });
                res.render("students_section", {section_students_id, username, section_id, role, ref_code});
          })
          .catch(err => {
            console.log(err);
            res.render("students_section", {section_id, username, role, ref_code});
          });

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;