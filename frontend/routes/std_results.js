const express = require('express');
//define an express method
const router = express.Router();
const axios = require('axios');

const authenticateUser = require("../middleware/auth/authentication");


//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{

        const sections = [];
        const username = req.session.user.username;
        const role = req.session.user.role;
        const ref_code = parseInt(req.session.user.ref_code);

        function axiosStudentSections(id) {
            return axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/students/${id}/sections`, {
                auth: {
                  username: `${process.env.API_USER}`,
                  password: `${process.env.API_PASS}`
                }
            }).then(response => response.data).catch(err => {console.log(err)})
        };

        const db_sections_students = await axiosStudentSections(ref_code);
        if (!db_sections_students) {
            res.render("std_result", {sections, username, role, ref_code});
        };

        db_sections_students.forEach(element => {
                sections.push({section_id: element.section_id, status: element.status, 
                    last_update_at: element.last_update_at, results: element.results}) 
               
        });
        res.render("std_result", {sections, username, role, ref_code});

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//export the router we have define above
module.exports = router;