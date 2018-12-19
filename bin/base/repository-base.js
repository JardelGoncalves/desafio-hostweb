const Query = require("../helpers/query");
const connection = require("../config/db-connection")();
const Promise = require("promise");
const md5 = require("md5");

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
                        message: table + " não encontrado!",
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


module.exports.post = (_validador, data, table) => {
    return new Promise((resolve, reject) => {

        if (_validador.erros.length === 0) {

            // Query é um modulo criado para facilitar as consultas no db
            connection.query(Query.save(data, table), (err, result) => {
                if (result) {
                    resolve({
                        message: "Cadastrado realizado com sucesso",
                        status: 201
                    })
                } else {
                    console.log(err)
                    reject({
                        message: "Ocorreu um erro inesperado!",
                        status: 503
                    })
                }
            })

        } else {
            reject({
                message: "Não foi possivel finalizar o cadastro",
                erros: _validador.erros,
                status: 400
            })
        }
    })
}


module.exports.put = (_validador, id, data, table) => {
    return new Promise((resolve, reject) => {

        if (_validador.erros.length === 0) {
            connection.query(Query.findByIdAndUpdate(table, id, data), (err, result) => {

                if (result) {
                    if (result.affectedRows === 1) {
                        resolve({
                            message: "Atualizado com sucesso!",
                            status: 202
                        })
                    } else {
                        reject({
                            message: "Usuário não encontrado",
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
        } else {
            reject({
                message: "Não foi possivel atualzar seus dados!",
                erros: _validador.erros,
                status: 400
            })
        }
    })
}



module.exports.delete = (table, id) => {
    return new Promise((resolve, reject) => {
        connection.query(Query.findByIdAndRemove(table, id), (err, result) => {
            if (result) {
                if (result.affectedRows === 1) {
                    resolve({
                        message: "Removido com sucesso!",
                        status: 202
                    })
                } else {
                    reject({
                        message: "Não encontrado!",
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