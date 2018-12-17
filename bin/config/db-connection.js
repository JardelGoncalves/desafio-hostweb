const mysql = require("mysql");

// conexão com o banco
module.exports = () => {
    return mysql.createConnection({
        host: "localhost",
        user: "hostweb_user",
        password: "admin",
        database: "desafio_hostweb"
    });
};