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
            'date_of_birth': '10/10/1990',
            'address': 'My Address',
            'city': 'Athens',
            'zipcode': '12345',
            'telephone': '2101122333',
            'phone': '2103322111',
            'mobile': '6971234567',
            'email': 'prof2@email.com',
            'year_group': '2020',
            'is_active': 'Y',
            'notes': 'some notes'
        }, 
        {
            'id': 2,
            'username': 'asbasile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'date_of_birth': '10/10/1990',
            'address': 'My Address',
            'city': 'Athens',
            'zipcode': '12345',
            'telephone': '2101122333',
            'phone': '2103322111',
            'mobile': '6971234567',
            'email': 'prof2@email.com',
            'year_group': '2020',
            'is_active': 'Y',
            'notes': 'some notes'
        },
        {
            'id': 3,
            'username': 'asbasile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'date_of_birth': '10/10/1990',
            'address': 'My Address',
            'city': 'Athens',
            'zipcode': '12345',
            'telephone': '2101122333',
            'phone': '2103322111',
            'mobile': '6971234567',
            'email': 'prof2@email.com',
            'year_group': '2020',
            'is_active': 'Y',
            'notes': 'some notes'
        }];

        data.forEach(element => {
            students.push({id: element.id, username: element.username, first_name: element.first_name, 
                last_name: element.last_name, date_of_birth: element.date_of_birth, address: element.address,
                city: element.city, zipcode: element.zipcode, telephone: element.telephone, 
                phone: element.phone, mobile: element.mobile, email: element.email, 
                year_group: element.year_group, is_active: element.is_active, notes: element.notes
                })
        });

        res.render("students_list", {students, username});

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
            'section_id': 'maths_1',
            'id': 1,
            'username': 'asbasile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'date_of_birth': '10/10/1990',
            'address': 'My Address',
            'city': 'Athens',
            'zipcode': '12345',
            'telephone': '2101122333',
            'phone': '2103322111',
            'mobile': '6971234567',
            'email': 'prof2@email.com',
            'year_group': '2020',
            'is_active': 'Y',
            'notes': 'some notes'
        }, 
        {
            'section_id': 'maths_2',
            'id': 2,
            'username': 'asbasile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'date_of_birth': '10/10/1990',
            'address': 'My Address',
            'city': 'Athens',
            'zipcode': '12345',
            'telephone': '2101122333',
            'phone': '2103322111',
            'mobile': '6971234567',
            'email': 'prof2@email.com',
            'year_group': '2020',
            'is_active': 'Y',
            'notes': 'some notes'
        },
        {
            'section_id': 'maths_3',
            'id': 3,
            'username': 'asbasile',
            'first_name': 'Vasilis',
            'last_name': 'Tsatalis',
            'date_of_birth': '10/10/1990',
            'address': 'My Address',
            'city': 'Athens',
            'zipcode': '12345',
            'telephone': '2101122333',
            'phone': '2103322111',
            'mobile': '6971234567',
            'email': 'prof2@email.com',
            'year_group': '2020',
            'is_active': 'Y',
            'notes': 'some notes'
        }];

        data.forEach(element => {
            students.push({section_id: element.section_id, id: element.id, username: element.username, first_name: element.first_name, 
                last_name: element.last_name, date_of_birth: element.date_of_birth, address: element.address,
                city: element.city, zipcode: element.zipcode, telephone: element.telephone, 
                phone: element.phone, mobile: element.mobile, email: element.email, 
                year_group: element.year_group, is_active: element.is_active, notes: element.notes
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