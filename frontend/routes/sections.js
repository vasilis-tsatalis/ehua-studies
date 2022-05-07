const express = require('express');
//define an express method
const router = express.Router();

const authenticateUser = require("../middleware/auth/authentication");

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
            'id': 1,
            'username': 'basile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        }, 
        {
            'id': 2,
            'username': 'basile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        },
        {
            'id': 3,
            'username': 'basile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        }];

        data.forEach(element => {
            sections.push({id: element.id, username: element.username, fname: element.first_name, 
                           lname: element.last_name, email: element.email, year: element.year 
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
            'id': 1,
            'username': 'basile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        }, 
        {
            'id': 2,
            'username': 'basile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        },
        {
            'id': 3,
            'username': 'basile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        },
        {
            'id': 2,
            'username': 'basile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        },
        {
            'id': 2,
            'username': 'basile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        },
        {
            'id': 2,
            'username': 'basile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        },
        {
            'id': 2,
            'username': 'basile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        },
        {
            'id': 2,
            'username': 'basile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        },  
        {
            'id': 2,
            'username': 'basile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'email': 'tsatalis.vas@gmail.com',
            'year': '2020'
        }];

        data.forEach(element => {
            sections.push({id: element.id, username: element.username, fname: element.first_name, 
                           lname: element.last_name, email: element.email, year: element.year 
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