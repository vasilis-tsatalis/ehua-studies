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
            'username': 'prof1',
            'first_name': 'John',
            'last_name': 'Dag',
            'date_of_birth': '10/10/1970',
            'address': 'My Address',
            'city': 'Athens',
            'zipcode': '12345',
            'telephone': '2101122333',
            'office_phone': '2103322111',
            'mobile': '6971234567',
            'email': 'prof1@email.com',
            'title': 'professor',
            'level': 'mid',
            'is_active': 'Y',
            'notes': 'some notes'
        }, 
        {
            'id': 2,
            'username': 'prof2',
            'first_name': 'John',
            'last_name': 'Dag',
            'date_of_birth': '10/10/1970',
            'address': 'My Address',
            'city': 'Athens',
            'zipcode': '12345',
            'telephone': '2101122333',
            'office_phone': '2103322111',
            'mobile': '6971234567',
            'email': 'prof2@email.com',
            'title': 'professor',
            'level': 'mid',
            'is_active': 'Y',
            'notes': 'some notes'
        },
        {
            'id': 3,
            'username': 'prof3',
            'first_name': 'John',
            'last_name': 'Dag',
            'date_of_birth': '10/10/1970',
            'address': 'My Address',
            'city': 'Athens',
            'zipcode': '12345',
            'telephone': '2101122333',
            'office_phone': '2103322111',
            'mobile': '6971234567',
            'email': 'prof3@email.com',
            'title': 'professor',
            'level': 'mid',
            'is_active': 'Y',
            'notes': 'some notes'
        }];

        data.forEach(element => {
            professors.push({id: element.id, username: element.username, first_name: element.first_name, 
                last_name: element.last_name, date_of_birth: element.date_of_birth, address: element.address, 
                city: element.city, zipcode: element.zipcode, telephone: element.telephone, 
                office_phone: element.office_phone, mobile: element.mobile, email: element.email, 
                title: element.title, level: element.level, is_active: element.is_active, notes: element.notes
                            })
        });


        res.render("professors_list", {professors, username});
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

router.get('/sections', authenticateUser, async (req, res) => {
    try{
        const professors = [];
        const username = req.session.user.username;

        //const data = await get_data('/professors');

        const data = [{
            'section_id': 'bigdata_1',
            'id': 1,
            'username': 'prof1',
            'first_name': 'John',
            'last_name': 'Dag',
            'date_of_birth': '10/10/1970',
            'address': 'My Address',
            'city': 'Athens',
            'zipcode': '12345',
            'telephone': '2101122333',
            'office_phone': '2103322111',
            'mobile': '6971234567',
            'email': 'prof1@email.com',
            'title': 'professor',
            'level': 'mid',
            'is_active': 'Y',
            'notes': 'some notes'
        }, 
        {
            'section_id': 'bigdata_2',
            'id': 2,
            'username': 'prof2',
            'first_name': 'John',
            'last_name': 'Dag',
            'date_of_birth': '10/10/1970',
            'address': 'My Address',
            'city': 'Athens',
            'zipcode': '12345',
            'telephone': '2101122333',
            'office_phone': '2103322111',
            'mobile': '6971234567',
            'email': 'prof2@email.com',
            'title': 'professor',
            'level': 'mid',
            'is_active': 'Y',
            'notes': 'some notes'
        },
        {
            'section_id': 'bigdata_3',
            'id': 3,
            'username': 'prof3',
            'first_name': 'John',
            'last_name': 'Dag',
            'date_of_birth': '10/10/1970',
            'address': 'My Address',
            'city': 'Athens',
            'zipcode': '12345',
            'telephone': '2101122333',
            'office_phone': '2103322111',
            'mobile': '6971234567',
            'email': 'prof3@email.com',
            'title': 'professor',
            'level': 'mid',
            'is_active': 'Y',
            'notes': 'some notes'
        },
        {
            'section_id': 'devops_3',
            'id': 4,
            'username': 'prof3',
            'first_name': 'John',
            'last_name': 'Dag',
            'date_of_birth': '10/10/1970',
            'address': 'My Address',
            'city': 'Athens',
            'zipcode': '12345',
            'telephone': '2101122333',
            'office_phone': '2103322111',
            'mobile': '6971234567',
            'email': 'prof3@email.com',
            'title': 'professor',
            'level': 'mid',
            'is_active': 'Y',
            'notes': 'some notes'
        },
        {
            'section_id': 'devops_7',
            'id': 5,
            'username': 'prof3',
            'first_name': 'John',
            'last_name': 'Dag',
            'date_of_birth': '10/10/1970',
            'address': 'My Address',
            'city': 'Athens',
            'zipcode': '12345',
            'telephone': '2101122333',
            'office_phone': '2103322111',
            'mobile': '6971234567',
            'email': 'prof3@email.com',
            'title': 'professor',
            'level': 'mid',
            'is_active': 'Y',
            'notes': 'some notes'
        },
        {
            'section_id': 'maths_1',
            'id': 6,
            'username': 'prof3',
            'first_name': 'John',
            'last_name': 'Dag',
            'date_of_birth': '10/10/1970',
            'address': 'My Address',
            'city': 'Athens',
            'zipcode': '12345',
            'telephone': '2101122333',
            'office_phone': '2103322111',
            'mobile': '6971234567',
            'email': 'prof3@email.com',
            'title': 'professor',
            'level': 'mid',
            'is_active': 'Y',
            'notes': 'some notes'
        }];

        data.forEach(element => {
            professors.push({section_id: element.section_id, id: element.id, username: element.username, first_name: element.first_name, 
                last_name: element.last_name, office_phone: element.office_phone, mobile: element.mobile, 
                email: element.email, title: element.title, level: element.level
                            })
        });

        res.render("professors_section", {professors, username});
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