const express = require('express');
//define an express method
const router = express.Router();
const axios = require('axios');

const authenticateUser = require("../middleware/auth/authentication");

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        const docs_types = [];
        const username = req.session.user.username;
        const role = req.session.user.role;
        const ref_code = req.session.user.ref_code;

        await axios.get(`${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/documents_types`, {
            auth: {
              username: `${process.env.API_USER}`,
              password: `${process.env.API_PASS}`
            }
          })
          .then(response => {
                const metadata = response.data;
                //console.log(metadata);
                if (metadata.length == 0) {
                    res.render("documents", {docs_types, username, role, ref_code});
                };
                metadata.forEach(element => {
                    docs_types.push({id: element.id, name: element.name, description: element.description})
                });
            res.render("documents", {docs_types, username, role, ref_code});
          })
          .catch(err => {
            console.log(err);
            res.render("documents", {docs_types, username, role, ref_code});
          });

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


router.post('/', authenticateUser, async (req, res) => {
  try{

      const username = req.session.user.username;
      const role = req.session.user.role;
      const ref_code = req.session.user.ref_code;

      const api_url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/documents`;

      const metadata = {
        // professor_id: 3,
        // document_type_id: 1,
        // notes: "",
        // name: String(req.file.filename),
        // bucket: username,
        // extension: "",
        // filename: req.file.filename,
        // url: String(presignedUrl),
        // expiration_days: 7
    };

      axios.post(api_url, metadata, {
        auth: {
            username: `${process.env.API_USER}`,
            password: `${process.env.API_PASS}`
          },
      })
      .then(function (response) {
        //console.log(response.data);
        res.render("documents", {username, message: 'OK', role, ref_code});
      })
      .catch(function (error) {
        console.log(error);
      });

  }catch(err){
      res.sendStatus(400).json({ message:err });
  }
});

//export the router we have define above
module.exports = router;