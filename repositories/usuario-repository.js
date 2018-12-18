"use strict"

const connection = require("../bin/config/db-connection")();
const validation = require("../bin/helpers/validation");
const Query = require("../bin/helpers/query");
const Promise = require("promise");
const md5 = require("md5");


/**
 * Módulo responsável por verificar/validar as informações e acessar o banco
 */

module.exports.authenticate = (Email, Password) => {
    return new Promise((resolve, reject) => {
        let hashPassword = md5(Password);
        connection.query(Query.findOne("usuario", {
            email: Email,
            password: hashPassword
        }, "AND", "id, nome, email"), (err, result) => {
            if (result && result.length > 0) {
                resolve(result);
            } else {
                console.log(err)
                reject(err);
            }
        })
    })
}

module.exports.register = (data) => {
    return new Promise((resolve, reject) => {

        // cria um validation para armazenar mensagens de erros
        let _validador = new validation();

        // Validações
        _validador.isRequired(data.nome, "Nome é requerido!");
        _validador.isRequired(data.email, "Email é requerido!");
        _validador.isRequired(data.password, "Senha é requerido!");
        _validador.isEmail(data.email, "Email inválido!");

        // verifica se não houve erro
        if (_validador.erros.length === 0) {
            // faz o hash da senha (password)
            data.password = md5(data.password);
            // consulta no banco se há usuários com o email informado na requisição
            connection.query(Query.findByEmail("usuario", data.email), (err, result) => {
                if (result) {
                    // se não há usuario com aquele email, insere no banco
                    if (result.length == 0) {
                        // Query é um modulo criado para facilitar as consultas no db
                        connection.query(Query.save(data, "usuario"), (err, result) => {
                            if (result) {
                                resolve({
                                    message: "Usuário cadastrado com sucesso",
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
                            message: "Não foi possivel realizar o cadastro",
                            erros: ["Email já em uso!"],
                            status: 400
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
                message: "Não foi possivel realizar o cadastro",
                erros: _validador.erros,
                status: 400
            })
        }
    })
}


// retorna todos os usuários no banco
module.exports.getAll = () => {
    return new Promise((resolve, reject) => {
        connection.query(Query.find("usuario", "id, nome, email"), (err, result) => {
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
module.exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(Query.findById("usuario", id, "id, nome, email"), (err, result) => {
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

// Atualiza o nome e a senha do usuário
module.exports.put = (id, data) => {
    return new Promise((resolve, reject) => {

        let _validador = new validation();

        // Validações (só atualizará apenas essas informações)
        _validador.isRequired(data.nome, "Nome é requerido!");
        _validador.isRequired(data.password, "Senha é requerido!");

        // Verifica se é uma nova senha, caso seja, é feito o hash
        connection.query(Query.findById("usuario", id, "id, nome, email"), (err, result) => {
            if (result && result.length == 1) {

                if (result[0].password !== data.password) {
                    data.password = md5(data.password)
                }
            } else {
                console.log(err)
                reject({
                    message: "Ocorreu um erro inesperado!",
                    status: 503
                })
            }
        });

        // caso não falhe em nenhum validation, atualiza as informações
        if (_validador.erros.length === 0) {
            connection.query(Query.findByIdAndUpdate("usuario", id, data), (err, result) => {

                if (result) {
                    resolve({
                        message: "Atualizado com sucesso!",
                        status: 202
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
                message: "Não foi possivel atualzar seus dados!",
                erros: _validador.erros,
                status: 400
            })
        }

    })

}

// Remove um usuário pelo ID
module.exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        connection.query(Query.findByIdAndRemove("usuario", id), (err, result) => {
            if (result) {
                resolve({
                    message: "Usuário removido com sucesso!",
                    status: 202
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