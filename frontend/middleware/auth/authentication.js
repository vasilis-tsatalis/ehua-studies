// Authentication module 
// after keycloak validation
// based on username and role

const { TIMEOUT } = require('dns');
const fs = require('fs');

module.exports = (req, res, next) => {
    if (!req.session.user) {
      //res.send("You're not allowed to view this content! Please login first!");

          //read the image using fs and send the image content back in the response
      fs.readFile('./assets/auth_login.png', function (err, content) {
        if (err) {
            res.writeHead(400, {'Content-type':'text/html'})
            console.log(err);
            res.end("No such image");    
        } else {
            //specify the content type in the response will be an image
            res.writeHead(200,{'Content-type':'image/jpg'});
            res.end(content);
        }
      });

      //res.sendStatus(403);
      return;
    }
    //else continue
    next();
  };
