const express = require('express');
//define an express method
const router = express.Router();

const authenticateUser = require("../middleware/auth/authentication");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const docs_types = [];
        const username = req.session.user.username;

        //const data = await get_data('/exams');

        const data = [{
            'id': 1,
            'name': 'notification',
            'description': 'Notification Document'
        }, 
        {
            'id': 2,
            'name': 'exam',
            'description': 'Exam Document'
        },
        {
            'id': 3,
            'name': 'exercise',
            'description': 'Exercise - Project Document'
        },
        {
            'id': 4,
            'name': 'result',
            'description': 'Results Section Document'
        },
        {
            'id': 5,
            'name': 'other',
            'description': 'General Purpose Documents'
        }];

        data.forEach(element => {
            docs_types.push({id: element.id, name: element.name, description: element.description})
        });

        res.render("docs_types", {docs_types, username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});




router.post('/', authenticateUser, async (req, res) => {
    try{
        res.render("docs_types");
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;