// Authentication module 
// after keycloak validation
// based on username and role

module.exports = (req, res, next) => {
    if (!req.session.user) {
      res.send("You're not allowed to view this content! Please login first!");
      //res.sendStatus(403);
      return;
    }
    //else continue
    next();
  };
