
module.exports = (req, res, next) => {
    if (!req.session.user) {
      res.send("You need admin rights to enter!");
      //res.sendStatus(403);
      return;
    }
    //else continue
    next();
  };