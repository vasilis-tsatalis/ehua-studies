const express = require('express');
//define an express method
const router = express.Router();

const authenticateUser = require("../middleware/auth/authentication");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{

        const courses = [];
        const username = req.session.user.username;

        //const data = await get_data('/courses');

        const data = [{
            'id': 1,
            'department_id': 1,
            'name': 'Software',
            'description': 'Software basic knowledge',
            'is_active': 'Y',
            'gravity': '6'
        }, 
        {
            'id': 2,
            'department_id': 1,
            'name': 'Database',
            'description': 'Database Design',
            'is_active': 'y',
            'gravity': '4'
        },
        {
            'id': 3,
            'department_id': 1,
            'name': 'Network',
            'description': 'Network and Security',
            'is_active': 'N',
            'gravity': '1'
        }];

        data.forEach(element => {
            courses.push({id: element.id, department_id: element.department_id, name: element.name, 
                        description: element.description, is_active: element.is_active, gravity: element.gravity 
                            })
        });

        res.render("courses", {courses, username});

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});




router.post('/', authenticateUser, async (req, res) => {
    try{
        res.render("courses");
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;