const express = require('express');
//define an express method
const router = express.Router();

const authenticateUser = require("../middleware/auth/authentication");
const get_data = require("../requests/get_backend");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const username = req.session.user.username;
        res.render("students", {username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


router.get('/all', authenticateUser, async (req, res) => {
    try{

        const students = [];
        const username = req.session.user.username;

        //const data = await get_data('/students');

        const data = [{
            'id': 1,
            'username': 'asbasile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        }, 
        {
            'id': 2,
            'username': 'cvbasile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        },
        {
            'id': 3,
            'username': 'ghbasile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        }];

        data.forEach(element => {
            students.push({id: element.id, username: element.username, fname: element.first_name, 
                           lname: element.last_name, email: element.email, year: element.year 
                            })
        });

        res.render("students_list", {students, username});

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});



router.get('/courses', authenticateUser, async (req, res) => {
    try{

        const students = [];
        const username = req.session.user.username;

        //const data = await get_data('/students');

        const data = [{
            'id': 1,
            'username': 'asbasile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        }, 
        {
            'id': 2,
            'username': 'cvbasile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        },
        {
            'id': 3,
            'username': 'ghbasile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        }];

        data.forEach(element => {
            students.push({id: element.id, username: element.username, fname: element.first_name, 
                           lname: element.last_name, email: element.email, year: element.year 
                            })
        });

        res.render("students_course", {students, username});

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


router.get('/sections', authenticateUser, async (req, res) => {
    try{

        const students = [];
        const username = req.session.user.username;

        //const data = await get_data('/students');

        const data = [{
            'id': 1,
            'username': 'asbasile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        }, 
        {
            'id': 2,
            'username': 'cvbasile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        },
        {
            'id': 3,
            'username': 'ghbasile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        }];

        data.forEach(element => {
            students.push({id: element.id, username: element.username, fname: element.first_name, 
                           lname: element.last_name, email: element.email, year: element.year 
                            })
        });

        res.render("students_section", {students, username});

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


router.post('/', authenticateUser, async (req, res) => {
    try{
        res.render("students");
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;