const express = require('express');
//define an express method
const router = express.Router();
const axios = require('axios');
const multer = require("multer");
const path = require("path")

const authenticateUser = require("../middleware/auth/authentication");
const minioClient = require('../tools/object-storage/minio_cl');
const helpers = require('../tools/upload_filter');

//----------ROUTES----------//

//define storage location of the documents local
// const storage = multer.diskStorage({destination: function(req, file, cb) {
//     cb(null, 'uploaded');
//     },
//     // By default, multer removes file extensions add it back
//     filename: function(req, file, cb) {
//         cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
//     }
// });



// var upload = multer({ dest: "Upload_folder_name" })
// If you do not want to use diskStorage then uncomment it

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
  
        // Uploads is the Upload_folder_name
        cb(null, "uploaded")
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now()+".png")
    }
  })


// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1 * 1000 * 1000;
    
var upload = multer({ 
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb){
    
        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);
  
        var extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes);
      } 
  
// mypic is the name of file attribute
}).single("doc_conv"); 



router.post('/', authenticateUser, async (req, res) => {
    try{

        const username = req.session.user.username;

        // const { docs_type } = req.body;
        // console.log(docs_type);

        // let upload = multer({ storage: storage, fileFilter: helpers.docFilter }).single('doc_conv');

        // upload(req, res, async function(err) {
        //     // req.file contains information of uploaded file
        //     // req.body contains information of text fields, if there were any
      
        //     if (req.fileValidationError) {
        //         //return res.send(req.fileValidationError);
        //         return res.render("documents", { username, message: req.fileValidationError });
        //     }
        //     else if (!req.file) {
        //         //return res.send('Please select a document to upload');
        //         return res.render("documents", { username, message: 'Please select a document to upload' });
        //     }
        //     else if (err instanceof multer.MulterError) {
        //         //return res.send(err);
        //         return res.render("documents", {username, message: err});
        //     }
        //     else if (err) {
        //         //return res.send(err);
        //         return res.render("documents", {username, message: err});
        //     }

        //     console.log(req.file.path);
        //     console.log(req.file);

        //     res.render("dashboard", {username});

        // });

        // Error MiddleWare for multer file upload, so if any
        // error occurs, the image would not be uploaded!
        upload(req,res,function(err) {
    
            if(err) {
    
                // ERROR occured (here it can be occured due
                // to uploading image of size greater than
                // 1MB or uploading different file type)
                res.send(err)
            }
            else {
    
                // SUCCESS, image successfully uploaded
                res.send("Success, Image uploaded!")
            }
        })


    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;