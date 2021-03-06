const express = require('express');
//define an express method
const router = express.Router();
const axios = require('axios');

const authenticateUser = require("../middleware/auth/authentication");


//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;

        res.render("sections", {username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


router.get('/myselection', authenticateUser, async (req, res) => {
    try{

        const sections = [];
        const username = req.session.user.username;
        const db_professor_id = req.session.user.db_professor_id;

        await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/professors/${db_professor_id}/sections`, {
            auth: {
              username: `${process.env.API_USER}`,
              password: `${process.env.API_PASS}`
            }
          })
          .then(response => {
                const metadata = response.data;
                //console.log(metadata);
                if (metadata.length == 0) {
                    res.render("sections_selection", {sections, username});
                };
                metadata.forEach(element => {
                    sections.push({course_id: element.course_id, id: element.id, professor_id: element.professor_id, 
                        classroom_type_id: element.classroom_type_id, year: element.year, 
                        exam_type_id: element.exam_type_id
                                    })                
                    });
                res.render("sections_selection", {sections, username});
          })
          .catch(err => {
            console.log(err);
            res.render("sections_selection", {sections, username});
          });

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


router.get('/genselection', authenticateUser, async (req, res) => {
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
                    res.render("sections_selection", {sections, username});
                };
                metadata.forEach(element => {
                    sections.push({course_id: element.course_id, id: element.id, professor_id: element.professor_id, 
                        classroom_type_id: element.classroom_type_id, year: element.year, 
                        exam_type_id: element.exam_type_id
                                    })                
                    });
                res.render("sections_selection", {sections, username});
          })
          .catch(err => {
            console.log(err);
            res.render("sections_selection", {sections, username});
          });

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


router.post('/students', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;
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
                    res.render("students_section", {username, section_id});
                };
                metadata.forEach(element => {
                    section_students_id.push({student_id: element.student_id, section_id: element.section_id, 
                        status: element.status, results: element.results, creation_user: element.creation_user, 
                        creation_date: element.creation_date, last_update_at: element.last_update_at
                        })                
                    });
                res.render("students_section", {section_students_id, username, section_id});
          })
          .catch(err => {
            console.log(err);
            res.render("students_section", {section_id, username});
          });

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;