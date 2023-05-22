const mysql = require("mysql2");
require("dotenv").config();

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'MyVocabulary'
});


module.exports = {
    connection
}
