const mysql = require("mysql");

// conexão com o banco
module.exports = () => {
    return mysql.createConnection({
        host: "db",
        user: "root",
        password: "admin",
        database: "desafio_hostweb",
        port: 3306
    });
};