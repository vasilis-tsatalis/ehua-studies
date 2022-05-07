const express = require('express');
//define an express method
const router = express.Router();

const authenticateUser = require("../middleware/auth/authentication");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const exams = [];
        const username = req.session.user.username;

        //const data = await get_data('/exams');

        const data = [{
            'id': 1,
            'name': 'Speaking',
            'gravity': '10'
        }, 
        {
            'id': 2,
            'name': 'Final',
            'gravity': '40'
        },
        {
            'id': 3,
            'name': 'Presentation',
            'gravity': '20'
        },
        {
            'id': 4,
            'name': 'Project',
            'gravity': '30'
        }];

        data.forEach(element => {
            exams.push({id: element.id, name: element.name, gravity: element.gravity})
        });

        res.render("exams", {exams, username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});




router.post('/', authenticateUser, async (req, res) => {
    try{
        res.render("exams");
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;