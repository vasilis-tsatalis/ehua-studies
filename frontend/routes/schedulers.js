const express = require('express');
//define an express method
const router = express.Router();

const authenticateUser = require("../middleware/auth/authentication");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const schedulers = [];
        const username = req.session.user.username;

                //const data = await get_data('/schedulers');

                const data = [{
                    'id': 1,
                    'name': 'scde1',
                    'day': 'Monday',
                    'start_time': '17:00:00',
                    'end_time': '19:30:00'
                }, 
                {
                    'id': 2,
                    'name': 'scde2',
                    'day': 'Monday',
                    'start_time': '19:30:00',
                    'end_time': '22:00:00'
                },
                {
                    'id': 3,
                    'name': 'scde3',
                    'day': 'Tuesday',
                    'start_time': '17:00:00',
                    'end_time': '19:30:00'
                },
                {
                    'id': 4,
                    'name': 'scde4',
                    'day': 'Tuesday',
                    'start_time': '19:30:00',
                    'end_time': '22:00:00'
                },
                {
                    'id': 5,
                    'name': 'scde5',
                    'day': 'Wednesday',
                    'start_time': '17:00:00',
                    'end_time': '19:30:00'
                },
                {
                    'id': 6,
                    'name': 'scde6',
                    'day': 'Wednesday',
                    'start_time': '19:30:00',
                    'end_time': '22:00:00'
                },
                {
                    'id': 7,
                    'name': 'scde7',
                    'day': 'Thursday',
                    'start_time': '17:00:00',
                    'end_time': '19:30:00'
                },
                {
                    'id': 8,
                    'name': 'scde8',
                    'day': 'Thursday',
                    'start_time': '19:30:00',
                    'end_time': '22:00:00'
                },  
                {
                    'id': 9,
                    'name': 'scde9',
                    'day': 'Friday',
                    'start_time': '17:00:00',
                    'end_time': '19:30:00'
                },  
                {
                    'id': 10,
                    'name': 'scde10',
                    'day': 'Friday',
                    'start_time': '19:30:00',
                    'end_time': '22:00:00'
                }];
        
                data.forEach(element => {
                    schedulers.push({id: element.id, name: element.name, day: element.day, start_time: element.start_time, end_time: element.end_time})
                });


        res.render("schedulers", {schedulers, username});
        
    } catch(err){
        res.sendStatus(400).json({ message:err });
    }
});




router.post('/', authenticateUser, async (req, res) => {
    try{
        res.render("schedulers");
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;