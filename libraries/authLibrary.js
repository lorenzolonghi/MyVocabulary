const db = require("../database");
const jwt = require("jsonwebtoken")

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if(!token){ return res.redirect("/login"); }

  jwt.verify(token, "secretkey", (err, decodedToken) => {
    if(err){ return res.redirect("/login"); }

    next();
  })
 
}

const getUserInfo = (req, res, next) => {
  const token = req.cookies.jwt;

  if(!token){ 
    res.locals.user = undefined;
    return next();
  }

  jwt.verify(token, "secretkey", (err, decodedToken) => {
    if(err){ 
      res.locals.user = undefined;
      return next();
    }

    const id = decodedToken.id;
    db.connection.query("SELECT PKUser AS id, Email AS email, Surname AS surname, Name AS name FROM Users WHERE PKUser = ?", [id], (err, result) => {
      if(err){
        console.log(err);
        return next();
      }
      res.locals.user = result[0];
      next();
    })
  })
}

module.exports = {
  requireAuth,
  getUserInfo
}