const validationLibrary = require("../libraries/validationLibrary");
const db = require("../database");
const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'secretkey', {
    expiresIn: maxAge
  });
};

const register_get = (req, res) => {
    return res.sendFile(path.join(__dirname, "../views/auth/register.html"));
}

const login_get = (req, res) => {
    return res.sendFile(path.join(__dirname, "../views/auth/login.html"));
}

const register_post = async (req, res) => {
    const {surname, name, email, password, confirmPassword} = req.body;

    const validateResult = validationLibrary.validateUser(req.body);
    if(validateResult != ""){
        return res.status(400).json(validateResult);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    db.connection.query("INSERT INTO Users (Surname, Name, Email, Password) VALUES (?, ?, ?, ?)", [surname, name, email, hashedPassword], (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json("Errore interno, riprova più tardi");
        } 
    
        return res.status(200).end();
    })
}

const login_post = async (req, res) => {
    const {email, password} = req.body;
    
    if(!email) { return res.status(400).json("Email non valida"); }
    if(!password) { return res.status(400).json("Password non valida"); }
    
    db.connection.query("SELECT PKUser as id, Email AS email, Password AS password FROM Users WHERE Email = ?", [email], async (err, result) => {
        if(err){
            console.log(err);
            return res.status(500).json("Errore interno, riprova più tardi");
        } 
        if(result.length === 0){ return res.status(400).json("Email non trovata"); }

        const user = result[0];
        const auth = await bcrypt.compare(password, user["password"]);
        if (!auth) {
            return res.status(400).json("Password errata");
        }

        //if password is ok create token
        const token = createToken(user["id"]);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).end(); 
    })
}

const logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}



module.exports = {
    register_get,
    login_get,
    register_post,
    login_post, 
    logout
}