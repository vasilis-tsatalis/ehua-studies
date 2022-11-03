const express = require('express');
//define an express method
const router = express.Router();
const axios = require('axios');

const authenticateUser = require("../middleware/auth/authentication");
const minioClient = require('../tools/object-storage/minio_cl');

//----------ROUTES----------//

router.get('/', authenticateUser, async (req, res) => {
    try{
        
        const username = req.session.user.username;
        const role = req.session.user.role;

        const mydocuments = [];

        const data = [];
        var stream = minioClient.listObjects(username,'', true)
        stream.on('data', function(obj) { data.push(obj) } )
        stream.on("end", function (obj) { 
            //console.log(data)
            //const mydocuments = data;
            //console.log(mydocuments);
            
            data.forEach(element => {
                minioClient.presignedUrl('GET', username, element.name, 7*24*60*60, function(err, presignedUrl) {
                    if(err) return console.log(err);
                    
                    mydocuments.push({
                        name: element.name, 
                        lastModified: element.lastModified, 
                        etag: element.etag, 
                        size: element.size,
                        presignedUrl: presignedUrl,
                        valid_days: 7
                    })
                });
            });

            res.render("uploaded_documents", {mydocuments, username, role});
        })
        stream.on('error', function(err) { console.log(err) } )

    }catch(err){
        res.sendStatus(400).json({ message:err });
    }
});


//export the router we have define above
module.exports = router;