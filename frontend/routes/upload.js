const express = require('express');
//define an express method
const router = express.Router();
const axios = require('axios');
const multer = require("multer");
const path = require("path")
const fs = require('fs');
const base64 = require('base-64');
const uuid = require("uuid");

const authenticateUser = require("../middleware/auth/authentication");
const minioClient = require('../tools/object-storage/minio_cl');
const helpers = require('../tools/upload_filter');

//----------ROUTES----------//

// to use diskStorage is bthe below
// var upload = multer({ dest: "Upload_folder_name" })

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Uploads is the Upload_folder_name
        cb(null, "uploaded")
    },
    filename: function (req, file, cb) {
      const id = uuid.v4();
      //cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
      cb(null, "[" + id + "]" + file.originalname)
    }
})

// Define the maximum size for uploading
// picture i.e. 10 MB. it is optional
const maxSize = 10 * 1000 * 1000;

router.post('/', authenticateUser, async (req, res) => {
    try{

        const username = req.session.user.username;
        const role = req.session.user.role;

        // const docs_type = req.body;
        // console.log(docs_type);

        let upload = multer({ storage: storage, fileFilter: helpers.docFilter }).single('doc_conv');
        const api_url = `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_URL}/documents`;

        // const metadata = {
        //     professor_id: 3,
        //     document_type_id: 1,
        //     notes: "",
        //     name: String(req.file.filename),
        //     bucket: username,
        //     extension: "",
        //     filename: req.file.filename,
        //     url: "",
        //     expiration_days: 7
        // };

        // axios.post(api_url, metadata, {
        //     headers: {
        //         'Authorization': 'Basic ' + base64.encode(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}`)
        //     },
        //   })
        //   .then(function (response) {
        //     console.log(response.data);
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //   });

        // Error MiddleWare for multer file upload, so if any
        // error occurs, the image would not be uploaded!
        upload(req,res,function(err) {
    
            if(err) {
                // ERROR occured due
                // to uploading file of size greater than
                // 10MB or uploading different file type
                // res.send(err)
                return res.render("documents", {username, message: err, role});               
            }
            else {
                console.log(req.file.path);
                console.log(req.file.originalname);
                console.log(req.file.filename);
                console.log(req.file.size);

                minioClient.bucketExists(username, function(err, exists) {
                    if (err) return console.log(err);
                    if (!exists) {
                        minioClient.makeBucket(username, 'europe-west2-a', function(err) {
                            if (err) return console.log('Error creating bucket.', err);
                        })
                    };
                    const stream = fs.createReadStream('./' + req.file.path);
                    const the_file = stream.on("data", function(data) {
                        const chunk = data.toString();
                        return chunk;
                    });
                    minioClient.putObject(username, req.file.filename, the_file, function(error, etag) {
                        if(error) return console.log(error);

                        minioClient.presignedUrl('GET', username, req.file.filename, 7*24*60*60, function(err, presignedUrl) {
                            if(err) return console.log(err);
                            return res.render("documents", {username, presignedUrl: presignedUrl, role});
                        });

                    });
                });

                //return res.render("documents", {username, message: "Success, File uploaded!"});
            }
        })
    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});

//export the router we have define above
module.exports = router;
