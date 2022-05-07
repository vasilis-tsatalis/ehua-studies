const express = require('express');
//define an express method
const router = express.Router();

const authenticateUser = require("../middleware/auth/authentication");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const classrooms = [];
        const username = req.session.user.username;

                //const data = await get_data('/classrooms');

                const data = [{
                    'id': 1,
                    'name': 'Class 1',
                    'building': 'Floor 1',
                    'number': '3A',
                    'type': 'laboratory'
                }, 
                {
                    'id': 2,
                    'name': 'Class 2',
                    'building': 'Floor 3',
                    'number': '3B',
                    'type': 'room'
                },
                {
                    'id': 3,
                    'name': 'Class 3',
                    'building': 'Floor 1',
                    'number': '3A',
                    'type': 'laboratory'
                },
                {
                    'id': 4,
                    'name': 'Class 4',
                    'building': 'Floor 2',
                    'number': '5AS',
                    'type': 'room'
                }];
        
                data.forEach(element => {
                    classrooms.push({id: element.id, name: element.name, building: element.building, number: element.number, type: element.type})
                });


        res.render("classrooms", {classrooms, username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});




router.post('/', authenticateUser, async (req, res) => {
    try{
        res.render("classrooms");
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;