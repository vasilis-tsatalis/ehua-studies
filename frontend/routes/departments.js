const express = require('express');
//define an express method
const router = express.Router();

const authenticateUser = require("../middleware/auth/authentication");
const get_backend = require("../requests/get_backend");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const departments = [];
        const username = req.session.user.username;

        //const data = await get_data('/exams');

        const data = [{
            'id': 1,
            'name': 'informatics&telematics',
            'description': 'Information Technology and Telematics',
            'points': '6'
        }, 
        {
            'id': 2,
            'name': 'network&security',
            'description': 'Network Administration and Security',
            'points': '5'
        },
        {
            'id': 3,
            'name': 'database_administrator',
            'description': 'Database Administrator',
            'points': '4'
        }];

        data.forEach(element => {
            departments.push({id: element.id, name: element.name, description: element.description, points: element.points})
        });

        res.render("departments", {departments, username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});




router.post('/', authenticateUser, async (req, res) => {
    try{
        res.render("departments");
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;