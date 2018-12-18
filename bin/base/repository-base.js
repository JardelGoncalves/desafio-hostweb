const Query = require("../helpers/query");
const connection = require("../config/db-connection")();
const Promise = require("promise");

/**
 * Este modúlo possui os métodos repetidos dos repositories
 * dessa forma reduzi a repetição de código)
 */

// retorna todos os usuários no banco
module.exports.getAll = (table, projection) => {
    return new Promise((resolve, reject) => {
        connection.query(Query.find(table, projection), (err, result) => {
            if (result) {
                resolve({
                    message: result,
                    status: 200
                })
            } else {
                console.log(err)
                reject({
                    message: "Ocorreu um erro inesperado!",
                    status: 503
                })
            }
        })
    })
}

// Obtem um usuário pelo id
module.exports.getById = (table, id, projection) => {
    return new Promise((resolve, reject) => {
        connection.query(Query.findById(table, id, projection), (err, result) => {
            if (result) {
                if (result.length <= 0) {
                    reject({
                        message: "Nenhum usuário encontrado!",
                        status: 404
                    })
                } else {
                    resolve({
                        message: result,
                        status: 200
                    })
                }

            } else {
                console.log(err)
                reject({
                    message: "Ocorreu um erro inesperado!",
                    status: 503
                })
            }
        })
    })
}