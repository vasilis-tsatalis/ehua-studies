const express = require('express');
//define an express method
const router = express.Router();

const authenticateUser = require("../middleware/auth/authentication");
const get_backend = require("../requests/get_backend");

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

        //const data = await get_data('/students');

        const data = [{
            'course_id': '5',
            'id': 1,
            'professor_id': '14',
            'classroom_type_id': '8',
            'year': '2022',
            'exam_type_id': '3'
        }, 
        {
            'course_id': '5',
            'id': 2,
            'professor_id': '14',
            'classroom_type_id': '8',
            'year': '2022',
            'exam_type_id': '3'
        },
        {
            'course_id': '3',
            'id': 3,
            'professor_id': '14',
            'classroom_type_id': '8',
            'year': '2022',
            'exam_type_id': '3'
        },
        {
            'course_id': '59',
            'id': 4,
            'professor_id': '14',
            'classroom_type_id': '8',
            'year': '2022',
            'exam_type_id': '3'
        }];

        data.forEach(element => {
            sections.push({course_id: element.course_id, id: element.id, professor_id: element.professor_id, 
                classroom_type_id: element.classroom_type_id, year: element.year, 
                exam_type_id: element.exam_type_id
                            })
        });

        res.render("sections_selection", {sections, username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


router.get('/genselection', authenticateUser, async (req, res) => {
    try{

        const sections = [];
        const username = req.session.user.username;

                //const data = await get_data('/students');

                const data = [{
                    'course_id': '5',
                    'id': 1,
                    'professor_id': '14',
                    'classroom_type_id': '8',
                    'year': '2022',
                    'exam_type_id': '3'
                }, 
                {
                    'course_id': '5',
                    'id': 2,
                    'professor_id': '14',
                    'classroom_type_id': '8',
                    'year': '2022',
                    'exam_type_id': '3'
                },
                {
                    'course_id': '3',
                    'id': 3,
                    'professor_id': '14',
                    'classroom_type_id': '8',
                    'year': '2022',
                    'exam_type_id': '3'
                },
                {
                    'course_id': '59',
                    'id': 4,
                    'professor_id': '14',
                    'classroom_type_id': '8',
                    'year': '2022',
                    'exam_type_id': '3'
                }];
        
                data.forEach(element => {
                    sections.push({course_id: element.course_id, id: element.id, professor_id: element.professor_id, 
                        classroom_type_id: element.classroom_type_id, year: element.year, 
                        exam_type_id: element.exam_type_id
                                    })
                });

        res.render("sections_selection", {sections, username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});



router.post('/', authenticateUser, async (req, res) => {
    try{
        res.render("sections");
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;