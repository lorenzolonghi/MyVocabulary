const validator = require('validator');


const validateUser = (user) => {
    if(!user.surname) { return "Cognome non valido" }
    if(!user.name) { return "Nome non valido" }
    if(!user.email || !validator.isEmail(user.email)) { return "Email non valida" }
    if(!user.password) { return "Password non valida" }
    if(user.password.length < 6) { return "La password deve essere lunga almeno 6 caratteri" } 
    if(user.password != user.confirmPassword) { return "Le password non corrispondono" }
    return "";
}


module.exports = {
    validateUser
}