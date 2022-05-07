const express = require('express');
//define an express method
const router = express.Router();

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

        //const data = await get_data('/professors');

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
            professors.push({id: element.id, department_id: element.department_id, name: element.name, 
                        description: element.description, is_active: element.is_active, gravity: element.gravity 
                            })
        });


        res.render("professors_list", {professors, username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

router.get('/section', authenticateUser, async (req, res) => {
    try{
        const professors = [];
        const username = req.session.user.username;

        //const data = await get_data('/professors');

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
            professors.push({id: element.id, department_id: element.department_id, name: element.name, 
                        description: element.description, is_active: element.is_active, gravity: element.gravity 
                            })
        });

        res.render("professors_section", {professors, username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

router.get('/course', authenticateUser, async (req, res) => {
    try{
        const professors = [];
        const username = req.session.user.username;

        //const data = await get_data('/professors');

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
            professors.push({id: element.id, department_id: element.department_id, name: element.name, 
                        description: element.description, is_active: element.is_active, gravity: element.gravity 
                            })
        });

        res.render("professors_course", {professors, username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

router.post('/', authenticateUser, async (req, res) => {
    try{
        res.render("professors");
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;