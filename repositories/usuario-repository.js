"use strict"

const connection = require("../bin/config/db-connection")();
const validation = require("../bin/helpers/validation");
const Query = require("../bin/helpers/query");
const _repository_base = require("../bin/base/repository-base");
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
        _validador.isRequired(data.passwordConfirm, "Confirmação de senha é requerido!");
        _validador.isEqual((data.password && data.password === data.passwordConfirm), "Senha e Confirmação da senha não equivalentes ou não definidas!")
        _validador.isEmail(data.email, "Email inválido!");

        // consulta no banco se há usuários com o email informado na requisição
        connection.query(Query.findByEmail("usuario", data.email), (err, result) => {
            if (result) {
                // se não há usuario com aquele email, insere no banco
                if (result.length == 0) {
                    //verifica se a senha veio no corpo
                    if (data.password) {
                        // faz o hash da senha
                        data.password = md5(data.password);
                    }
                    // um novo objeto para enviar para o servidor
                    let user = {
                        nome: data.nome,
                        email: data.email,
                        password: data.password
                    }

                    // enviado para o repository-base (métodos padrões)
                    _repository_base.post(_validador, user, "usuario")
                        .then((success) => {
                            resolve(success)
                        })
                        .catch((failed) => {
                            reject(failed)
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
    })
}


// retorna todos os usuários no banco
module.exports.getAll = () => {
    return _repository_base.getAll("usuario", "id, nome, email");
}

// Obtem um usuário pelo id
module.exports.getById = (id) => {
    return _repository_base.getById("usuario", id)
}

// Atualiza o nome e a senha do usuário
module.exports.put = (id, data) => {
    return new Promise((resolve, reject) => {

        let _validador = new validation();

        // Verifica se é uma nova senha, caso seja, é feito o hash
        connection.query(Query.findById("usuario", id, "id, nome, email, password"), (err, result) => {
            if (result && result.length == 1) {
                let newData = {}
                if (data.password && (result[0].password !== data.password)) {
                    newData.password = md5(data.password)
                }

                if (data.nome) {
                    newData.nome = data.nome
                }

                // caso não falhe em nenhum validation, atualiza as informações
                _repository_base.put(_validador, id, newData, "usuario")
                    .then((success) => {
                        resolve(success)
                    })
                    .catch((failed) => {
                        reject(failed)
                    })
            } else {
                reject({
                    status:404,
                    message: "Usuário não encontrado"
                })
            }
        });
    })

}

// Remove um usuário pelo ID
module.exports.delete = (id) => {
    return _repository_base.delete("usuario", id)
}