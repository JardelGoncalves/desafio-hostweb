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
module.exports.getById = (table, id, message, projection) => {
    return new Promise((resolve, reject) => {
        connection.query(Query.findById(table, id, projection), (err, result) => {
            if (result) {
                if (result.length <= 0) {
                    reject({
                        message: message,
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

module.exports.delete = (table, id, message_202, message_404) => {
    return new Promise((resolve, reject) => {
        connection.query(Query.findByIdAndRemove(table, id), (err, result) => {
            if (result) {
                if (result.affectedRows === 1) {
                    resolve({
                        message: message_202,
                        status: 202
                    })
                } else {
                    reject({
                        message: message_404,
                        status: 404
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