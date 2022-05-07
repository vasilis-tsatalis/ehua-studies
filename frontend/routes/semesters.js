const express = require('express');
//define an express method
const router = express.Router();

const authenticateUser = require("../middleware/auth/authentication");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const semesters = [];
        const username = req.session.user.username;

        const data = [{
            'id': 1,
            'name': 'sem1',
            'description': 'Mondescription',
            'start_time': '17:00:00',
            'days_time': '19:30:00'
        }, 
        {
            'id': 2,
            'name': 'sem2',
            'description': 'Mondescription',
            'start_time': '19:30:00',
            'days_time': '22:00:00'
        },
        {
            'id': 3,
            'name': 'sem3',
            'description': 'Tuesdescription',
            'start_time': '17:00:00',
            'days_time': '19:30:00'
        },
        {
            'id': 4,
            'name': 'sem4',
            'description': 'Tuesdescription',
            'start_time': '19:30:00',
            'days_time': '22:00:00'
        },
        {
            'id': 5,
            'name': 'sem5',
            'description': 'Wednesdescription',
            'start_time': '17:00:00',
            'days_time': '19:30:00'
        },
        {
            'id': 6,
            'name': 'sem6',
            'description': 'Wednesdescription',
            'start_time': '19:30:00',
            'days_time': '22:00:00'
        },
        {
            'id': 7,
            'name': 'sem7',
            'description': 'Thursdescription',
            'start_time': '17:00:00',
            'days_time': '19:30:00'
        },
        {
            'id': 8,
            'name': 'sem8',
            'description': 'Thursdescription',
            'start_time': '19:30:00',
            'days_time': '22:00:00'
        },  
        {
            'id': 9,
            'name': 'sem9',
            'description': 'Fridescription',
            'start_time': '17:00:00',
            'days_time': '19:30:00'
        },  
        {
            'id': 10,
            'name': 'sem10',
            'description': 'Fridescription',
            'start_time': '19:30:00',
            'days_time': '22:00:00'
        }];

        data.forEach(element => {
            semesters.push({id: element.id, name: element.name, description: element.description, start_time: element.start_time, days_time: element.days_time})
        });


        res.render("semesters", {semesters, username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});




router.post('/', authenticateUser, async (req, res) => {
    try{
        res.render("semesters");
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;